yarn run build
mv lib/bundle.js ../kafka-connect-ui-prod/
cd ..
docker build . -t sharonxr55/kafka-connect-ui:$1
docker push sharonxr55/kafka-connect-ui:$1