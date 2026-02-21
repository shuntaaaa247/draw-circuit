class CircuitElement < ApplicationRecord
  belongs_to :project

  # 回転角度を正規化する
  # rotation_changed? は rotation が変更されたかどうかを検証するメソッドで、カラム名+_changed? という命名規則でrailsが自動で生成してくれる。
  # rotation_changed? が true になるのは rotation が変更された時(未保存の変更がある場合)。
  before_validation :normalize_rotation, if: :rotation_changed?

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
      element_type: element_type,
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

  # DB の rotation は decimal(5,2) のため絶対値 1000 未満必須。
  # Konva は回転を累積するため 360 を超える値が入ることがあるので 0～360 に正規化する。
  def normalize_rotation
    return if rotation.nil?
    self.rotation = ((rotation.to_f % 360) + 360) % 360 # 回転角度を0～360の範囲に正規化する(rotationの値が負の時にも対応する)
  end
  
  def needs_xy_position?
    %w[resistance dc_power_supply capacitor inductor].include?(element_type)
  end
  
  def needs_start_end_position?
    element_type == 'line'
  end

end
