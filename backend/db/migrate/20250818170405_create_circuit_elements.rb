class CreateCircuitElements < ActiveRecord::Migration[7.1]
  def change
    create_table :circuit_elements do |t|
      t.references :project, null: false, foreign_key: true
      t.string :element_type, null: false
      t.decimal :x_position, precision: 10, scale: 2
      t.decimal :y_position, precision: 10, scale: 2
      t.decimal :width, precision: 10, scale: 2
      t.decimal :height, precision: 10, scale: 2
      t.decimal :rotation, precision: 5, scale: 2
      t.jsonb :properties, default: {}

      t.timestamps
    end
    add_index :circuit_elements, :element_type # インデックスを作成
    add_index :circuit_elements, :properties, using: :gin # インデックスを作成
  end
end
