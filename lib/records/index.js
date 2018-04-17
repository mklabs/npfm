const fs   = require('fs');
const uuid = require('uuid/v4');
const glob = require('glob');
const path = require('path');

const schemas = glob.sync(path.join(__dirname, '*.js'))
  .map(file => path.basename(file).replace(path.extname(file), ''))
  .filter(file => file !== 'index.js');

class Adapter {
  constructor(record) {
    this.record = record;
  }

  data() {
    return this.record.data();
  }
}

class Record {
  constructor(schema, adapter) {
    this.name = schema;
    this.schema = require(`./${schema}.js`);
    this.adapter = adapter || new Adapter(this);
    this._data = {};
  }

  create() {}
  read() {}
  update() {}
  delete() {}

  data() {
    return Object.assign({}, this._data);
  }

  generateUpdateCommand() {
    // TODO: generate based on schema
    return `
      add_record@@command_uuid:{657635b6-28d9-45fb-9709-87fd5d29e395}

      @@table:battle_set_pieces
      @@uuid:{146b1bc4-deed-4cbf-9683-8dc88a4757b6}
      @@field_name:battle_duration@@field_data:60
      @@field_name:battle_environment@@field_data:weather/battle/wh_wef_morghur_01.environment
      @@field_name:battle_name@@field_data:mk_taurox_qb_bst_morghur_stave_of_ruinous_corruption
      @@field_name:battle_script@@field_data:script\battle\quest_battles\morghur\stave_of_ruinous_corruption\battle_script.lua
      @@field_name:battle_type@@field_dependency_uuid:{fc73134d-30ce-406b-9659-df8b482d85c0}@@field_data:classic
      @@field_name:battlefield_folder@@field_data:qb_dlc05_morghur
      @@field_name:bmd_layer_type@@field_dependency_uuid:{ef2f3fd2-1dad-42d2-858f-d3997e65366a}@@field_data:quest_battle_2
      @@field_name:catchment_area@@field_data:
      @@field_name:frontend_icon_offset_x@@field_data:0
      @@field_name:frontend_icon_offset_y@@field_data:0
      @@field_name:game_expansion_key@@field_dependency_uuid:{816b6698-8621-45aa-8efb-9d3a07d5e6ed}@@field_data:core
      @@field_name:intro_movie@@field_data:
      @@field_name:is_player_attacker@@field_data:false
      @@field_name:localised_description@@field_data:These pathetic forest-dwelling Elves come for Morghur, but he must hold fast. The ritual is well underway - he cannot let Ariel and her minions take from him that which he has toiled over for so long. Morghur is beset, but the position is defensible; the waves of Elves will come and crash upon the Beastmen as waves crash upon the rocks. They shall leave nothing for Ariel to identify them by. A Ruinous power flows through Morghur, so that he might smite the Elven pretenders with Chaotic fury!
      @@field_name:localised_name@@field_data:Stave of Ruinous Corruption
      @@field_name:outro_movie_lose@@field_data:
      @@field_name:outro_movie_win@@field_data:
      @@field_name:teleport_cost@@field_data:500
      @@field_name:use_large_armies@@field_data:true
    `;
  }
}

const records = module.exports = schemas.map(schema => new Record(schema));
records.Record = Record;
