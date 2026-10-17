FROM python:3.12-slim-bookworm@sha256:34386ef0cb081344d7ec1c103ba398e6e9f64e9ab3a1509accc92a4e24a07258 AS engine
RUN apt-get update && apt-get install -y --no-install-recommends gfortran make autoconf automake libc6-dev && rm -rf /var/lib/apt/lists/*
COPY vendor /src/voacapl
WORKDIR /src/voacapl
RUN autoreconf -fi && ./configure FFLAGS="-O2 -fallow-argument-mismatch" && make -j2 && make install

FROM python:3.12-slim-bookworm@sha256:34386ef0cb081344d7ec1c103ba398e6e9f64e9ab3a1509accc92a4e24a07258 AS runtime
# libquadmath0 is an amd64 dependency of libgfortran5, not an arm64 package.
# Version/package/license drift is rejected by audit_runtime.py below.
RUN apt-get update && apt-get install -y --no-install-recommends --no-upgrade libgfortran5=12.2.0-14+deb12u1 && rm -rf /var/lib/apt/lists/*
# The application uses only the standard library. Do not distribute unused
# package installers and their many bundled third-party dependencies.
RUN python -m pip uninstall --yes pip setuptools wheel && rm -rf /usr/local/lib/python3.12/ensurepip
COPY --from=engine /usr/local/bin/voacapl /usr/local/bin/voacapl
COPY --from=engine /usr/local/share/voacapl /usr/local/share/voacapl
COPY --from=engine /src/voacapl/LICENSE /licenses/voacapl-LICENSE
COPY --from=engine /src/voacapl/COPYING /licenses/voacapl-COPYING
COPY LICENSE /licenses/app-MIT-LICENSE
COPY THIRD_PARTY_NOTICES.md DATA_LICENSES.md /licenses/
COPY licenses /licenses/project
COPY scripts/audit_runtime.py /tmp/audit_runtime.py
RUN python /tmp/audit_runtime.py /licenses/project/runtime-license-lock.json /licenses/runtime && rm /tmp/audit_runtime.py
WORKDIR /app
COPY app /app
ENV DATA_DIR=/data PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN mkdir /data && chmod 777 /data
USER 10001:10001
EXPOSE 8000
HEALTHCHECK --interval=20s --start-period=10s CMD python -c "import json,urllib.request; assert json.load(urllib.request.urlopen('http://127.0.0.1:8000/api/health'))['ok']"
CMD ["python", "server.py"]

# Only the release-bundle builder targets this stage. A missing exact source
# archive aborts the build; an image-only distribution is not a release.
FROM runtime AS redistribution-sources
USER root
COPY scripts/collect_sources.py /tmp/collect_sources.py
RUN mkdir -p /redistribution/sources && cp /licenses/runtime/runtime-inventory.json /redistribution/runtime-inventory.json && python /tmp/collect_sources.py /redistribution/runtime-inventory.json /redistribution/sources

# Flatten the audited filesystem into a new image: deleting pip in a normal
# layered image would otherwise still redistribute pip in the lower layers.
# Never redistribute the engine/runtime/source-build stages or build cache.
FROM scratch AS final
COPY --from=runtime / /
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin LANG=C.UTF-8 DATA_DIR=/data PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
USER 10001:10001
EXPOSE 8000
HEALTHCHECK --interval=20s --start-period=10s CMD ["python", "-c", "import json,urllib.request; assert json.load(urllib.request.urlopen('http://127.0.0.1:8000/api/health'))['ok']"]
CMD ["python", "server.py"]
