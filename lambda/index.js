exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  const newVersion = 'version=new';
  const oldVersion = 'version=old';

  const newSiteDomain = '<your new bucket>.s3-website-us-east-1.amazonaws.com';
  const oldSiteDomain = '<your old bucket>.s3-website-us-east-1.amazonaws.com';

  let domain = '';

  if (headers.cookie) {
    for (let i = 0; i < headers.cookie.length; i++) {
      // if version=new cookie found
      if (headers.cookie[i].value.indexOf(newVersion) >= 0) {
        // switch to new site
        domain = newSiteDomain;
        break;
      } else if (headers.cookie[i].value.indexOf(oldVersion) >= 0) {
        // switch to old site
        domain = oldSiteDomain;
        break;
      }
    }

    request.origin = {
      custom: {
        domainName: domain,
        port: 80,
        protocol: 'http',
        path: '',
        sslProtocols: ['TLSv1', 'TLSv1.1'],
        readTimeout: 5,
        keepaliveTimeout: 5,
        customHeaders: {},
      },
    };
    request.headers['host'] = [{ key: 'host', value: domain }];
    callback(null, request);
  } else {
    callback(null, request);
    return;
  }
};
