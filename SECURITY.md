# Security Policy

## Handling credentials and secrets

- Never commit real credentials (API keys, tokens, passwords, private keys) to this repository.
- Use environment variables for runtime secrets.
- Keep example values in `.env.example` as non-production placeholders only.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set real values in your local `.env.local`.
3. Do not commit `.env.local` or other `.env.*` files.

## Rotation guidance

If any credential is exposed:

1. Revoke/rotate it immediately in the upstream provider.
2. Replace repository values with placeholders or environment-variable references.
3. Review recent commits and pull requests for additional exposure.
