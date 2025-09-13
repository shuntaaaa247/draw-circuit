class ApplicationController < ActionController::API # ActionControllerモジュールのAPIクラスを継承
  include ActionController::HttpAuthentication::Token::ControllerMethods # トークン認証に便利なヘルパーメソッドを読み込んでいます。

  private

  def authenticate_user
    # ヘッダーの内容を詳しく出力
    p "=== Request Headers ==="
    request.headers.each do |key, value|
      p "#{key}: #{value}"
    end
    p "======================="
    p "request.headers['Cookie']: #{request.headers['Cookie']}"
    @current_user = User.find_by(decoded_token[:user_id])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound, JWT::ExpiredSignature # rescueはエラーが発生した場合に実行される
    # メソッドの中では、メソッド全体が暗黙的に begin ... end で囲まれているため、begin を省略して rescue だけ書ける
    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def current_user
    @current_user
  end

  def encode_token(payload)
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end

  def decoded_token
    JWT.decode(
      token, 
      Rails.application.credentials.secret_key_base,
      true, # 署名検証を行う
      { algorithm: "HS256", verify_expiration: true } # アルゴリズムを指定
    )[0] # JWT.decodeは成功すると[payload, { "alg" => "HS256" }]という配列を返すので、[0]でpayloadを取得
  end

  def token
    if request.headers["Authorization"].present?
      request.headers["Authorization"].split(" ").last
    elsif request.headers["Cookie"].present?
      request.headers["Cookie"].split(";").find { |cookie| cookie.include?("token=") }.split("=").last
    else 
      nil
    end
    # request.headers["Authorization"].split(" ").last # HTTPヘッダー Authorization からトークンを取り出す。
    # Authorization: Bearer <token> という形式でトークンがクライアントから送信されるので、split(" ")でBearerと<token>に分割して、.lastで<token>を取得
    # &. はセーフナビゲーション演算子（nilでもエラーにならずnilを返す）
    # httpOnlyでtokenをCookieごと送信している場合は、request.headers["Cookie"]ではなく、request.headers["Cookie"].split(";").find { |cookie| cookie.include?("token=") }.split("=").lastでtokenを取得する
  end
end
