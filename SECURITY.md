# Security

The site is static and the only automation with write access is the signature workflow (`.github/workflows/sign.yml`), which treats issue text as untrusted input.

If you find a vulnerability, for example a way to forge someone else's signature, inject content into the site or abuse the workflows, please report it privately through [GitHub's private vulnerability reporting](https://github.com/promptstyles/promptstyles/security/advisories/new) instead of opening a public issue. We will reply as soon as we can.

To report a fake or abusive signature, open a regular issue or email the maintainers listed on the organization profile.
