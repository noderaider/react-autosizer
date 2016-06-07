import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { mount, shallow } from 'enzyme'
import { spy } from 'sinon'
const chai = require('chai')
chai.use(require('chai-enzyme')())
const should = chai.should()

describe('createAutoSizer', () => {
  const lib = require('../lib')
  const createAutoSizer = lib.default
  it('exists', () => should.exist(createAutoSizer))
  it('should be a function', () => createAutoSizer.should.be.a('function'))
})
