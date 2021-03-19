module.exports = {
    async rewrites() {
      return [
        {
            //source: '/api',
            //destination: 'http://localhost:8081/alllistings',
          source: '/api/:path*',
          destination: 'http://localhost:8081/:path*' // Proxy to Backend
        }
      ]
    }
  }