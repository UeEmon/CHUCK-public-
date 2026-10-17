# Local redistribution changes — 2026-10-15

Upstream: jawatson/voacapl, c12a98b348c39f36f2659b8b3aa97b86284c8a1d.

- Removed `logo.png` and four `man/*.1` files from this source tree and removed
  their references from `Makefile.am`. Their original provenance/permission
  scope was not established sufficiently for this project's redistribution.
  This is a conservative omission, not a finding that the upstream project
  lacked permission or that the works are legally nonredistributable.
- Added the author's GPL notice to `f90getopt.f90`, pointing to the upstream
  project and GPL text. Functional Fortran statements are unchanged.
- Added GPL texts and component-specific notices outside the vendor directory.
- Removed `voacapl/itshfbc/news/CONFIG.TXT`, a CRLF copy of `config.txt` with
  identical text. Their names differ only in case, so case-insensitive file
  systems (macOS and Windows defaults) kept one and reported the other as
  modified. `Makefile.am` installs only `config.txt`.

Impact: no calculation routines, coefficients, antenna files, station tables,
tests, or executables were removed. Command-line manual installation and the
unused upstream logo are omitted. DST conversion source and its GPL license
remain available; conversion binaries are not part of the runtime image.

Previous Git history is not rewritten. For redistribution, use the current
tree source archive produced by the release script, not the entire Git history.
