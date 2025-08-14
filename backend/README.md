# clj-swagger as custom endpoint

### Dev

Starting a CLJ Repl
```sh
clj -M:dev:nrepl
```

### Building

Clean the build
```sh
clj -T:build clean
```

Building frontend and jar

```sh
clj -T:build jar
```
and executing it via
```sh
java -jar target/lichtkraft.jar config/local.edn
```


### Testing

```sh
clj -X:test
```

## License
