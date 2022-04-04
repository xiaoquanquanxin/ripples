console.log('🕊️');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { resolve } = require('path');
module.exports = {
	mode: 'production',
	devtool: false,
	entry: {
		main: './src/js/index.js',
	},
	output: {
		path: resolve(__dirname, './dist'),
		filename: 'index.js',
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
 						}
					},
				],
				exclude: /node_modules/
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [{
					loader: 'file-loader',
				}],
			},
		],

	},
	optimization: {
		mangleWasmImports: true,
		minimize: true,
		minimizer: [
			new UglifyJsPlugin(),

			new CssMinimizerPlugin(),
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
				},
			}),
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new HtmlWebpackPlugin(
			{
				template: resolve(__dirname, './src/index.html'),
			},
		),
		new CopyPlugin({
			patterns: [
				{
					from: resolve(__dirname, 'assets'),
					to: resolve(__dirname, 'dist'),
				},
			],
		}),
	],
	devServer: {
		port: 9000,
	},
};
