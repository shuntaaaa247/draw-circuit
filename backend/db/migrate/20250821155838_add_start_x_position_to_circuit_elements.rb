class AddStartXPositionToCircuitElements < ActiveRecord::Migration[7.1]
  def change
    add_column :circuit_elements, :start_x_position, :decimal, precision: 10, scale: 2
    add_column :circuit_elements, :start_y_position, :decimal, precision: 10, scale: 2
    add_column :circuit_elements, :end_x_position, :decimal, precision: 10, scale: 2
    add_column :circuit_elements, :end_y_position, :decimal, precision: 10, scale: 2
  end
end
