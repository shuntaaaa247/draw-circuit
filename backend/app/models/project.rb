class Project < ApplicationRecord
  belongs_to :user
  has_many :circuit_elements, dependent: :destroy

  validates :name, presence: true, length: { minimum: 1, maximum: 100 }

  def circuit_data
    {
      id: id,
      name: name,
      description: description,

      # circuit_elements.map { |element| element.to_circuit_data }と同じ意味
      # :to_circuit_data はシンボル
      # &:to_circuit_data と書くと Ruby が自動的に proc { |x| x.to_circuit_data } というブロックに変換してくれる
      # procはブロックをオブジェクト化するためのもの
      circuit_elements: circuit_elements.map(&:to_circuit_data) 
    }
  end
end
