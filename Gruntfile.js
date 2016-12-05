module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var sriConfig = {
            options: {
                pretty: true
            }
        },
        sriWetDefaults = {
            expand: true,
            src: [
                "{js,css}/**/*.{js,css}"
            ]
        },
        sriThemesDefaults = {
            expand: true,
            src: [
                "{js,css}/*.{js,css}",
                "!**/*wet-boew*",
                "!**/noscript*",
                "!deps/",
                "!i18n/",
                "polyfills/",
            ]
        },
        versions = grunt.file.expand('*-dist-*'),
        versionsLength = versions.length,
        version, v, versionMatch, patchVersion, cwd;

    for (v = 0; v < versionsLength; v+= 1) {
        version = versions[v];

        versionMatch = version.match(/(.*)-dist-4\.0\.(\d*)(?:-\d)?(?:-(theme-.*|gcweb))?/);

        if (versionMatch) {
            patchVersion = parseInt(versionMatch[2], 10);

            if (versionMatch[1] === 'wet-boew' && patchVersion < 15) {
                sriConfig[version] = Object.assign({}, sriWetDefaults,  {
                    options: {
                        dest: version + '/payload.json'
                    },
                    cwd: version
                });
            } else if ( versionMatch[1] === 'wet-boew' && patchVersion >= 15 ) {
                cwd = version + '/wet-boew/';
                sriConfig[version + "_core"] = Object.assign({}, sriWetDefaults,  {
                    options: {
                        dest: cwd + '/payload.json'
                    },
                    cwd: cwd
                });

                cwd = version + '/theme-wet-boew/';
                sriConfig[version + "_theme"] = Object.assign({}, sriThemesDefaults,  {
                    options: {
                        dest: cwd + '/payload.json'
                    },
                    cwd: cwd
                });
            } else if (versionMatch[1] === 'themes' && patchVersion < 15) {
                sriConfig[version] = Object.assign({}, sriThemesDefaults,  {
                    options: {
                        dest: version + '/payload.json'
                    },
                    cwd: version
                });
            } else if (versionMatch[1] === 'themes' && patchVersion >= 15) {
                cwd = version + '/' + versionMatch[3].replace('gcweb', 'GCWeb');
                sriConfig[version] = Object.assign({}, sriThemesDefaults,  {
                    options: {
                        dest: cwd + '/payload.json'
                    },
                    cwd: cwd
                });
            }
        }
    }

    grunt.initConfig({
        sri: sriConfig,
        clean: {
            src: '**/payload.json'
        }
    });
    grunt.registerTask('default', ['sri']);
};
