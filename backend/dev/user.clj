(ns user
  (:require [clj-swagger.logging :as log]
            [clojure.java.io :as io]
            [clojure.tools.namespace.repl :as repl]
            [integrant.core :as ig]
            [integrant.repl :as ir]
            [lambdaisland.classpath.watch-deps :as watch-deps]))

(comment
  (log/set-log-level! 'clj-swagger.server :debug))

(defn watch-deps! []
  (watch-deps/start! {:aliases [:dev :test]}))

(comment
  (repl/set-refresh-dirs (io/file "src") (io/file "dev"))
  (repl/refresh)
  (repl/clear)
  (watch-deps!))

(def config {:clj-swagger.server/server {:port 8081 :dev-mode? true}})

(ir/set-prep! #(ig/expand config))

(defn init
  "Start the server"
  ([] (init config))
  ([config]
   (watch-deps!)
   (ig/load-namespaces config)
   (ir/prep)
   (ir/init)))

(defn stop
  "Stop the server"
  []
  (ir/halt))

(defn reset
  "Restart the server"
  []
  (stop)
  (ir/go))

(comment
  (init)
  (reset)
  (stop))
