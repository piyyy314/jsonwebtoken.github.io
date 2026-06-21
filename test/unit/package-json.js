import chai from 'chai';

import pkg from '../../package.json';

chai.should();

const semverCaretRange = /^\^(\d+)\.(\d+)\.(\d+)$/;

function parseCaret(range) {
  const m = semverCaretRange.exec(range);
  if (!m) return null;
  return { major: parseInt(m[1], 10), minor: parseInt(m[2], 10), patch: parseInt(m[3], 10) };
}

describe('package.json', function() {
  describe('structure', function() {
    it('has a name field', function() {
      pkg.should.have.property('name');
    });

    it('has a version field', function() {
      pkg.should.have.property('version');
    });

    it('has a dependencies object', function() {
      pkg.should.have.property('dependencies');
      pkg.dependencies.should.be.an('object');
    });

    it('has a devDependencies object', function() {
      pkg.should.have.property('devDependencies');
      pkg.devDependencies.should.be.an('object');
    });

    it('has a scripts object', function() {
      pkg.should.have.property('scripts');
      pkg.scripts.should.be.an('object');
    });
  });

  describe('updated dependencies', function() {
    const changedDeps = {
      '@octokit/rest': '^20.0.0',
      'express': '^4.19.2',
      'jstransformer-markdown-it': '^3.0.0',
      'pug': '^3.0.0',
    };

    Object.entries(changedDeps).forEach(function([name, expectedRange]) {
      it(`${name} has version range ${expectedRange}`, function() {
        pkg.dependencies.should.have.property(name);
        pkg.dependencies[name].should.equal(expectedRange);
      });
    });
  });

  describe('updated devDependencies', function() {
    const changedDevDeps = {
      '@babel/core': '^7.29.6',
      'bootstrap': '^5.0.0',
      'codemirror': '^6.0.0',
      'grunt': '^1.6.0',
      'grunt-contrib-pug': '^3.0.0',
      'grunt-crx': '^2.0.0',
      'jose': '^4.15.5',
      'lodash': '^4.17.23',
      'mocha': '^6.0.0',
      'node-forge': '^1.3.2',
      'puppeteer': '^24.15.0',
      'sinon': '^16.1.2',
      'stylus': '^0.55.0',
      'tv4-formats': '^3.0.4',
      'uglifyjs-webpack-plugin': '^2.0.0',
      'web-ext': '^3.0.0',
      'webpack': '^5.0.0',
    };

    Object.entries(changedDevDeps).forEach(function([name, expectedRange]) {
      it(`${name} has version range ${expectedRange}`, function() {
        pkg.devDependencies.should.have.property(name);
        pkg.devDependencies[name].should.equal(expectedRange);
      });
    });
  });

  describe('semver range format for changed packages', function() {
    const allChanged = {
      '@octokit/rest': pkg.dependencies['@octokit/rest'],
      'express': pkg.dependencies['express'],
      'jstransformer-markdown-it': pkg.dependencies['jstransformer-markdown-it'],
      'pug': pkg.dependencies['pug'],
      '@babel/core': pkg.devDependencies['@babel/core'],
      'bootstrap': pkg.devDependencies['bootstrap'],
      'codemirror': pkg.devDependencies['codemirror'],
      'grunt': pkg.devDependencies['grunt'],
      'grunt-contrib-pug': pkg.devDependencies['grunt-contrib-pug'],
      'grunt-crx': pkg.devDependencies['grunt-crx'],
      'jose': pkg.devDependencies['jose'],
      'lodash': pkg.devDependencies['lodash'],
      'mocha': pkg.devDependencies['mocha'],
      'node-forge': pkg.devDependencies['node-forge'],
      'puppeteer': pkg.devDependencies['puppeteer'],
      'sinon': pkg.devDependencies['sinon'],
      'stylus': pkg.devDependencies['stylus'],
      'tv4-formats': pkg.devDependencies['tv4-formats'],
      'uglifyjs-webpack-plugin': pkg.devDependencies['uglifyjs-webpack-plugin'],
      'web-ext': pkg.devDependencies['web-ext'],
      'webpack': pkg.devDependencies['webpack'],
    };

    Object.entries(allChanged).forEach(function([name, range]) {
      it(`${name} version range is a valid caret semver range`, function() {
        semverCaretRange.test(range).should.equal(true,
          `Expected "${range}" to be a valid caret semver range like ^X.Y.Z`
        );
      });
    });
  });

  describe('major version bumps are forward-only', function() {
    const majorBumps = [
      { name: '@octokit/rest', section: 'dependencies', oldMajor: 18, newRange: '^20.0.0' },
      { name: 'pug', section: 'dependencies', oldMajor: 2, newRange: '^3.0.0' },
      { name: 'jstransformer-markdown-it', section: 'dependencies', oldMajor: 2, newRange: '^3.0.0' },
      { name: 'bootstrap', section: 'devDependencies', oldMajor: 3, newRange: '^5.0.0' },
      { name: 'codemirror', section: 'devDependencies', oldMajor: 5, newRange: '^6.0.0' },
      { name: 'grunt-contrib-pug', section: 'devDependencies', oldMajor: 1, newRange: '^3.0.0' },
      { name: 'grunt-crx', section: 'devDependencies', oldMajor: 1, newRange: '^2.0.0' },
      { name: 'puppeteer', section: 'devDependencies', oldMajor: 1, newRange: '^24.15.0' },
      { name: 'sinon', section: 'devDependencies', oldMajor: 4, newRange: '^16.1.2' },
      { name: 'uglifyjs-webpack-plugin', section: 'devDependencies', oldMajor: 1, newRange: '^2.0.0' },
      { name: 'web-ext', section: 'devDependencies', oldMajor: 2, newRange: '^3.0.0' },
      { name: 'webpack', section: 'devDependencies', oldMajor: 4, newRange: '^5.0.0' },
    ];

    majorBumps.forEach(function({ name, section, oldMajor, newRange }) {
      it(`${name} major version is greater than the previous major version (${oldMajor})`, function() {
        const current = pkg[section][name];
        const parsed = parseCaret(current);
        parsed.should.not.equal(null, `Could not parse version range "${current}"`);
        parsed.major.should.be.above(oldMajor,
          `Expected major version > ${oldMajor}, got ${parsed.major}`
        );
      });
    });
  });

  describe('unchanged packages are still present', function() {
    const unchangedDeps = [
      '@formatjs/intl-localematcher',
      'dotenv',
      'express-sslify',
      'jstransformer-markdown',
      'lodash.debounce',
      'negotiator',
      'querystring',
    ];

    const unchangedDevDeps = [
      '@babel/polyfill',
      '@babel/preset-env',
      'babel-loader',
      'babel-plugin-transform-async-to-generator',
      'base64url',
      'bowser',
      'chai',
      'chai-arrays',
      'chai-as-promised',
      'chai-json-schema',
      'clipboard-polyfill',
      'deep-freeze',
      'esm',
      'flipclock',
      'grunt-cli',
      'grunt-contrib-clean',
      'grunt-contrib-connect',
      'grunt-contrib-copy',
      'grunt-contrib-stylus',
      'grunt-contrib-watch',
      'grunt-exec',
      'grunt-mocha-test',
      'grunt-webpack',
      'highlight.js',
      'inject-loader',
      'isotope-layout',
      'jquery',
      'loglevel',
      'nock',
      'promise.any',
      'request-promise-native',
      'sinon-chai',
      'source-map-support',
      'tippy.js',
      'webpack-merge',
      'xhr-mock',
    ];

    unchangedDeps.forEach(function(name) {
      it(`dependency "${name}" is still present`, function() {
        pkg.dependencies.should.have.property(name);
      });
    });

    unchangedDevDeps.forEach(function(name) {
      it(`devDependency "${name}" is still present`, function() {
        pkg.devDependencies.should.have.property(name);
      });
    });
  });

  describe('regression: no accidental version downgrade', function() {
    it('express version is at least 4.19.x (security fix)', function() {
      const parsed = parseCaret(pkg.dependencies['express']);
      parsed.should.not.equal(null);
      if (parsed.major === 4) {
        parsed.minor.should.be.at.least(19);
      } else {
        parsed.major.should.be.above(4);
      }
    });

    it('lodash devDependency is at least 4.17.23 (security fix)', function() {
      const parsed = parseCaret(pkg.devDependencies['lodash']);
      parsed.should.not.equal(null);
      parsed.major.should.equal(4);
      parsed.minor.should.equal(17);
      parsed.patch.should.be.at.least(23);
    });

    it('node-forge devDependency is at least 1.3.x (security fix)', function() {
      const parsed = parseCaret(pkg.devDependencies['node-forge']);
      parsed.should.not.equal(null);
      if (parsed.major === 1) {
        parsed.minor.should.be.at.least(3);
      } else {
        parsed.major.should.be.above(1);
      }
    });

    it('jose devDependency is at least 4.15.x', function() {
      const parsed = parseCaret(pkg.devDependencies['jose']);
      parsed.should.not.equal(null);
      if (parsed.major === 4) {
        parsed.minor.should.be.at.least(15);
      } else {
        parsed.major.should.be.above(4);
      }
    });
  });
});
