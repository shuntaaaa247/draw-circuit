# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:3000" # フロントエンドのURLから送信されたリクエストを許可する

    resource "*", # 全てのリソースを許可する('*' は「すべてのパスを対象にする」という意味。)
      headers: :any, # 全てのヘッダーを許可する
      methods: [:get, :post, :put, :patch, :delete, :options, :head], # 許可するメソッドを設定。API でよく使う CRUD 系 + options（プリフライトリクエスト用）+ head を許可
      credentials: true # Cookieの送信を許可する
  end
end
