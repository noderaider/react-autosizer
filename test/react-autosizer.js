import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { mount, shallow } from 'enzyme'
import { spy } from 'sinon'
const chai = require('chai')
chai.use(require('chai-enzyme')())
const should = chai.should()

describe('react-autosizer', () => {
  const lib = require('../lib')
  const reactAutosizer = lib.default
  it('exists', () => should.exist(reactAutosizer))
  it('should be a function', () => reactAutosizer.should.be.a('function'))
})
