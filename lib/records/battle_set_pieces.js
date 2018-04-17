// Schema for battle_set_pieces table
module.exports = {
  table: 'battle_set_pieces',

  // TODO: ad
  fields: [
    { name: 'battle_name', type: 'string', primary: true, required: true },
    { name: 'battle_type', type: 'string', dependency: 'battle_types:type', required: true },
    { name: 'battle_duration', type: 'number', default: 60, required: true  },
    { name: 'frontend_icon_offset_x', type: 'number', required: true, default: 0 },
    { name: 'frontend_icon_offset_y', type: 'number', required: true, default: 0 },
    { name: 'is_player_attacker', type: 'boolean', required: true, default: true },
    { name: 'use_large_armies', type: 'boolean', required: true, default: true },
    { name: 'localised_description', type: 'string', required: true, default: '<Placeholder>' },
    { name: 'localised_name', type: 'string', required: true, default: '<Placeholder>' },
    { name: 'use_large_armies', type: 'boolean', required: true, default: true },
    { name: 'battle_environment', type: 'string', default: 'weather/battle/wh_vmp_01.environment' },
    { name: 'battle_script', type: 'string' },
    { name: 'battlefield_folder', type: 'string' },
    { name: 'bmd_layer_type', type: 'string', dependency: 'bmd_export_types:name' },
    { name: 'catchment_area', type: 'string' },
    { name: 'game_expansion_key', type: 'string', dependency: 'texc_expansions:expansion' },
    { name: 'intro_movie', type: 'string', dependency: 'videos:video_name' },
    { name: 'outro_movie_lose', type: 'string', dependency: 'videos:video_name' },
    { name: 'outro_movie_win', type: 'string', dependency: 'videos:video_name' },
  ]
};
