const isProd = process.env.NODE_ENV === 'production';
module.exports = { output: 'export', basePath: isProd ? '/ocean-dive' : '', images: { unoptimized: true }, trailingSlash: true };
