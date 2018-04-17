const path  = require('path');
const debug = require('debug')('npfm');
const records = require('../records');
const { prompt, registerPrompt } = require('inquirer')
registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
const DB = require('../db');
const availableRecords = records.filter(record => record.name !== 'index');
const fuzzy = require('fuzzy');

const action = module.exports = async(options) => {
  const basename = path.basename(__filename);
  let [ table ] = options._.slice(1);
  if (!table) {
    const anwser = await prompt([{
      name: 'table',
      message: 'Which table ?',
      type: 'autocomplete',
      source: () => {
        return new Promise((resolve, reject) => resolve(availableRecords));
      }
    }]);

    table = anwser.table;
  }

  debug('Loading record for %s table', table);
  const db = new DB({
    filepath: path.resolve('./raw_data/db')
  });

  const record = records.find(record => record.name === table);
  if (!record) throw new Error(`
  No schema ${table} available. Available records:
    - ${availableRecords.map(record => record.name).join('\n    - ')}
  `);

  // Build questions out of the schema
  const { fields } = record.schema;
  const questions = fields.map((field) => {
  // const questions = fields.map((field) => {
    const { dependency, name, required } = field;
    const message = field.message || `${name}:`;

    const question = {
      type : 'input',
      name,
      message
    };

    if (typeof field.default !== 'undefined') question.default = field.default;
    if (dependency) {
      question.type = 'autocomplete';
      question.source = (answers, input) => {
        return db.dependsOn(dependency)
          .then((values) => {
            const results = fuzzy.filter(input || '', values)
              .map(value => value.string);

            return results;
          });
      };
    }

    if (required) question.validate = (s, anwsers) => {
      if (typeof field.default === 'undefined') {
        if (!s.length) return `${name} field is required`;
      }

      if (typeof s !== field.type) return `${s} is not a valid type. Expected a ${field.type}`;

      return true;
    };

    return question;
  });

  const answers = await prompt(questions);
  // console.log(questions);
};
