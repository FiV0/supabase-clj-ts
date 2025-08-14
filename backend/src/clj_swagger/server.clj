(ns clj-swagger.server
  (:require [clojure.tools.logging :as log]
            [integrant.core :as ig]
            [muuntaja.core :as m]
            [reitit.coercion.spec :as rc.spec]
            [reitit.core :as r]
            [reitit.http :as http]
            [reitit.http.coercion :as rh.coercion]
            [reitit.http.interceptors.exception :as ri.exception]
            [reitit.http.interceptors.muuntaja :as ri.muuntaja]
            [reitit.http.interceptors.parameters :as ri.parameters]
            [reitit.interceptor.sieppari :as r.sieppari]
            [reitit.openapi :as openapi]
            [reitit.ring :as r.ring]
            [reitit.spec :as rs]
            [reitit.swagger :as r.swagger]
            [reitit.swagger-ui :as swagger-ui]
            [ring.adapter.jetty :as j]
            [expound.alpha :as expound])
  (:import org.eclipse.jetty.server.Server))


(def ^:private muuntaja-opts m/default-options)

(def http-routes
  [["/v1"
    ["/custom"
     {:name :custom-route
      :summary "A custom route returning \"Hello World!\""
      :description "A simple GET request"}]]

   ["/swagger.json" {:name :swagger-json
                     :no-doc true
                     :swagger {:securityDefinitions {"auth" {:type :apiKey
                                                             :in :header
                                                             :name "Authorization"}}}}]

   ["/openapi.json" {:name :openapi-json
                     :no-doc true}]

   ["/api-docs/*" {:name :swagger-ui
                   :no-doc true}]])

(defmulti ^:private route-handler :name, :default ::default)

(defmethod route-handler :custom-route [_]
  {:muuntaja (m/create muuntaja-opts)

   :get {:handler (fn [{:as _req}]
                    {:status 200, :body {:message "Hello, world!"}})}})

(defmethod route-handler :swagger-json [_]
  {:muuntaja (m/create muuntaja-opts)
   :get {:handler (r.swagger/create-swagger-handler)}})

(defmethod route-handler :swagger-ui [_]
  {:muuntaja (m/create muuntaja-opts)
   :get {:handler (swagger-ui/create-swagger-ui-handler
                   {:config {:validatorUrl nil
                             :persistAuthorization true}})}})

(defmethod route-handler :openapi-json [_]
  {:muuntaja (m/create muuntaja-opts)
   :get {:handler (openapi/create-openapi-handler)}})

(defn- default-handler [^Throwable t _]
  {:status 500, :body {:class (.getName (.getClass t))
                       :message (.getMessage t)
                       :stringified (.toString t)}})

(defn coercion-error-handler [status]
  (let [printer (expound/custom-printer {:theme :figwheel-theme, :print-specs? false})
        handler (ri.exception/create-coercion-handler status)]
    (fn [exception request]
      (printer (-> exception ex-data :problems))
      (handler exception request))))

(def debug-response-interceptor
  {:name ::debug-response
   :leave (fn [ctx]
            (log/info "Response: " (:response ctx))
            ctx)})

(def router
  (let [m (m/create muuntaja-opts)]
    (http/router http-routes
                 {:expand (fn [{route-name :name, :as route} opts]
                            (r/expand (cond-> route
                                        route-name (merge (route-handler route)))
                                      opts))

                  :data {:muuntaja m
                         :coercion rc.spec/coercion
                         :interceptors [#_debug-response-interceptor
                                        r.swagger/swagger-feature
                                        openapi/openapi-feature
                                        (ri.parameters/parameters-interceptor)
                                        (ri.muuntaja/format-negotiate-interceptor)
                                        (ri.muuntaja/format-response-interceptor)
                                        (ri.muuntaja/format-request-interceptor)

                                        (ri.exception/exception-interceptor
                                         (merge ri.exception/default-handlers
                                                {:reitit.coercion/request-coercion (coercion-error-handler 422)
                                                 :reitit.coercion/response-coercion (coercion-error-handler 500)
                                                 ::ri.exception/default default-handler
                                                 ::ri.exception/wrap
                                                 (fn [handler e req]
                                                   #_(prn (:type (ex-data e))
                                                          (handler e req))
                                                   (log/error (format "response error (%s): '%s'" (class e) (ex-message e)))
                                                   (m/format-response m req (handler e req)))}))

                                        (rh.coercion/coerce-request-interceptor)]}
                  :validate rs/validate})))

(defn- with-opts [opts]
  {:enter (fn [ctx]
            (update ctx :request into opts))})

(defn handler [{:keys [] :as extra-opts}]
  (http/ring-handler router
                     (r.ring/create-default-handler)
                     {:executor r.sieppari/executor
                      :interceptors [[with-opts {:extra-opts extra-opts}]]}))

(defmethod ig/expand-key :clj-swagger.server/server [k opts]
  {k opts})

(defmethod ig/init-key :clj-swagger.server/server [_ {:keys [port dev-mode?] :as opts}]
  (let [f (fn [] (handler opts))
        ^Server server (j/run-jetty (if dev-mode?
                                      (r.ring/reloading-ring-handler f)
                                      (f))
                                    {:port port, :h2c? true, :h2? true
                                     :async? true :join? false})]
    (log/info "HTTP server started on port:" port)
    server))

(defmethod ig/halt-key! :clj-swagger.server/server [_ ^Server server]
  (.stop server)
  (log/info "HTTP server stopped"))
