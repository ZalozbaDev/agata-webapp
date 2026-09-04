# build

docker build -f docker/Dockerfile -t agata-webapp --progress=plain .  

# persona

Which persona this deployment talks to is set via `VITE_PERSONA` (build time in
`.env`, or at runtime through `docker/inject_env.sh` → `window._env_`). It
defaults to `agata`.

```
VITE_PERSONA=zalozba-spechowane-projekty
```

The value is sent as `persona` with every `/api/chat` request. The server owns
the actual configuration (collection, web share, language) — see the server
README. Unknown ids fall back to `agata` server-side.

For testing several personas from one deployment, `?persona=<id>` in the URL
overrides the env value.

