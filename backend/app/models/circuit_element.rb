class CircuitElement < ApplicationRecord
  belongs_to :project

  # inclusion: 「値が指定した集合（配列など）に含まれているかどうか」を検証するバリデーション。
  # in: 検証対象となる集合を指定。
  # %w[ ... ]: "..." をスペース区切りで文字列の配列にする Ruby の記法。
  validates :element_type, presence: true, inclusion: { in: %w[resistance dc_power_supply capacitor inductor line] }
  validates :x_position, :y_position, presence: true, numericality: true # numericality: trueは数値であることを確認する

  def to_circuit_data
    {
      id: id,
      type: element_type,
      x: x_position,
      y: y_position,
      width: width,
      height: height,
      rotation: rotation,
      properties: properties
    }
  end
end
