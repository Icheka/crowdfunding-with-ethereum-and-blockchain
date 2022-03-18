module.exports = {
    async redirects() {
        return [
            {
                source: '/campaigns',
                destination: '/',
                permanent: true,
            },
        ]
    },
}