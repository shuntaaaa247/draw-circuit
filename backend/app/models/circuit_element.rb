class CircuitElement < ApplicationRecord
  belongs_to :project

  # inclusion: 「値が指定した集合（配列など）に含まれているかどうか」を検証するバリデーション。
  # in: 検証対象となる集合を指定。
  # %w[ ... ]: "..." をスペース区切りで文字列の配列にする Ruby の記法。
  validates :element_type, presence: true, inclusion: { in: %w[resistance dc_power_supply capacitor inductor line] }
  
  # 要素タイプに応じて必要なフィールドを検証
  validates :x_position, :y_position, numericality: true, if: :needs_xy_position?
  validates :start_x_position, :start_y_position, :end_x_position, :end_y_position, numericality: true, if: :needs_start_end_position?
  
  def to_circuit_data
    {
      id: id,
      type: element_type,
      x_position: x_position,
      y_position: y_position,
      width: width,
      height: height,
      rotation: rotation,
      start_x_position: start_x_position,
      start_y_position: start_y_position,
      end_x_position: end_x_position,
      end_y_position: end_y_position,
      properties: properties
    }
  end

  private
  
  def needs_xy_position?
    %w[resistance dc_power_supply capacitor inductor].include?(element_type)
  end
  
  def needs_start_end_position?
    element_type == 'line'
  end

end
