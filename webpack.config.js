const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const webpack = require('webpack');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Debug: Log environment variables
  const useMocks = process.env.REACT_APP_USE_MOCKS || 'true'; // Default to true for development
  const mockDelay = process.env.REACT_APP_MOCK_DELAY || '0';
  
  console.log('🔧 Webpack Environment Variables:');
  console.log('  REACT_APP_USE_MOCKS:', useMocks);
  console.log('  REACT_APP_MOCK_DELAY:', mockDelay);

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      // Serve assets from root so /dashboard works by default
      publicPath: isProduction ? '/' : 'http://localhost:3000/'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@graphql': path.resolve(__dirname, 'src/graphql'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@utils': path.resolve(__dirname, 'src/utils')
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        'process.env.REACT_APP_USE_MOCKS': JSON.stringify(useMocks),
        'process.env.REACT_APP_MOCK_DELAY': JSON.stringify(mockDelay),
      }),
      new ModuleFederationPlugin({
        name: 'agreementApp',
        filename: 'remoteEntry.js',
        exposes: {
          './AgreementApp': './src/App',
          './AgreementWizard': './src/components/AgreementWizard',
          './Dashboard': './src/pages/Dashboard/Dashboard',
          './AgreementDetails': './src/pages/AgreementDetails/AgreementDetails',
          './CreateAgreement': './src/pages/CreateAgreement/CreateAgreement',
          './ModifyAgreement': './src/pages/ModifyAgreement/ModifyAgreement',
          './PendingModificationRequests': './src/pages/PendingModificationRequests/PendingModificationRequests'
        },
        dts: false, // Disable TypeScript type generation for now
        shared: {
          react: { 
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: false
          },
          'react-dom': { 
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: false
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.21.0',
            eager: false
          },
          '@mui/material': { 
            singleton: true,
            requiredVersion: '^5.15.0',
            eager: false
          },
          '@mui/icons-material': { 
            singleton: true,
            requiredVersion: '^5.15.0',
            eager: false
          },
          '@emotion/react': { 
            singleton: true,
            requiredVersion: '^11.11.1',
            eager: false
          },
          '@emotion/styled': { 
            singleton: true,
            requiredVersion: '^11.11.0',
            eager: false
          },
          '@apollo/client': { 
            singleton: true,
            requiredVersion: '^3.8.8',
            eager: false
          },
          'graphql': { 
            singleton: true,
            requiredVersion: '^16.8.1',
            eager: false
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      port: 3000,
      hot: true,
      historyApiFallback: true,
      open: true
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};
