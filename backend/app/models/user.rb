class User < ApplicationRecord
  has_secure_password # いい感じにパスワードを扱えるようにするメソッド
  has_many :projects, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP } # presence(存在しているか,nilや空文字ではないか)、uniqueness(一意性)、format(フォーマット)、URI::MailTo::EMAIL_REGEXP(メールアドレスのフォーマット)
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
end
