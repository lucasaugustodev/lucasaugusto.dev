# lucasaugusto.dev

Portfólio pessoal de Lucas Augusto: cloud e infraestrutura, sistemas de IA e game engineering.

## Rodar localmente

O site é estático e não possui dependências de runtime:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173`.

## Estrutura

- `index.html`: conteúdo, SEO, JSON-LD e estrutura semântica.
- `styles.css`: identidade visual, responsividade e animações.
- `script.js`: canvas do hero, interações, reveal e contadores.
- `profile.json`: currículo público estruturado para pessoas e agentes.
- `assets/`: mídia otimizada dos projetos.
- `.github/workflows/deploy.yml`: publicação automática no GitHub Pages.

## Deploy

Pushes em `main` publicam automaticamente no GitHub Pages. O domínio customizado é definido por `CNAME`.
