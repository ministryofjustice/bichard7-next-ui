docker run \
  --rm \
  --network="bichard_default" \
  -v $(pwd)/scripts:/zap/workspace:ro \
  -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -I -j\
    -t https://ui/bichard \
    -z "-configfile /zap/workspace/zap.config"

