# Security Policy

## Supported versions

Only the latest release and `main` receive fixes.

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's private vulnerability reporting
("Security" tab → "Report a vulnerability") on
<https://github.com/Atlas-6174/source-libraries>. Include the affected version or
commit, the steps to reproduce, and the impact.

You can expect an acknowledgement within 7 days. Vulnerabilities in the libraries
themselves may also need to be reported upstream at
<https://github.com/Jakubantalik/Libraries.dev>.

## Deployment hardening

- The container runs as an unprivileged user with a read-only filesystem and no
  Linux capabilities.
- The default bind address is `127.0.0.1`. Expose it publicly only behind a TLS
  reverse proxy that sets HSTS.
- The Content-Security-Policy allows `'unsafe-inline'` scripts, because upstream
  pages rely on inline scripts. It does not allow `'unsafe-eval'`.
