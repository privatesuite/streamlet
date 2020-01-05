/* eslint-disable quote-props */
/* eslint-disable no-undef */
const Database = require('../src/index')
const chai = require('chai')
const fs = require('fs')

const db = new Database('./db')
const assert = chai.assert
const testData = { 'type': 'test' }
let testId

describe('Test the database', function () {
  describe('Initialise the database', function () {
    it('Should create a read stream', async function () {
      assert.isArray(await db.init())
    })
  })
  describe('Modify the database', function () {
    it('Should add an item', async function () {
      assert.isString(await db.insert(testData))
    })
    it('Should find the item', async function () {
      const foundData = (await db.findOne(_ => _.type === 'test'))
      testId = foundData._id
      assert.include(foundData, testData)
    })
    it('Should edit the item', async function () {
      await db.edit(testId, { 'type': 'test', 'edit': true })
      const foundData = (await db.findOne(_ => _.type === 'test'))
      assert.include(foundData, testData)
    })
    it('Should delete the item', async function () {
      await db.delete(testId)
      const foundData = (await db.findOne(_ => _.type === 'test'))
      assert.isUndefined(foundData)
    })
  })
  describe('Cleanup', function () {
    it('Should delete the database file', function () {
      fs.unlink('./db', (err) => {
        assert.isNull(err)
      })
    })
  })
})
