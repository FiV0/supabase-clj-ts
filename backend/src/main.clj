(ns main
  (:require [clj-swagger.server]
            [clojure.tools.logging :as log]
            [integrant.core :as ig])
  (:gen-class))

(def ^Thread$UncaughtExceptionHandler uncaught-exception-handler
  (reify Thread$UncaughtExceptionHandler
    (uncaughtException [_ _thread throwable]
      (log/error throwable "Uncaught exception:"))))

(defn install-uncaught-exception-handler! []
  (when-not (Thread/getDefaultUncaughtExceptionHandler)
    (Thread/setDefaultUncaughtExceptionHandler uncaught-exception-handler)))

(def ^:private config {:clj-swagger.server/server {:port 8081 :dev-mode? false}})

(defn -main [& _args]
  (install-uncaught-exception-handler!)
  (let [system (ig/init (ig/expand config))]
    (.addShutdownHook (Runtime/getRuntime)
                      (Thread. (fn []
                                 (ig/halt! system))))))
