/**
 * Bootstrap Entry Point (Module Federation Pattern)
 * 
 * This file lazy loads the standalone version to ensure shared dependencies
 * are properly initialized before the app starts. This is critical for
 * Module Federation to work correctly.
 */
import './standalone';
