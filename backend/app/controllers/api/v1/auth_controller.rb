# $ docker compose run backend rails g controller api/v1/auth register loginで本コントローラーを作成

class Api::V1::AuthController < ApplicationController
  before_action :authenticate_user, only: [:check]

  def register
    user = User.new(user_params)
    if user.save
      token = encode_token({ user_id: user.id, exp: 24.hours.from_now.to_i }) # JWTを生成
      render json: { user: user.as_json(except: :password_digest), token: token }, status: :created # シンボルcreatedは201 Createdを表す password_digestは取り除いて返す
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity # シンボルunprocessable_entityは422 Unprocessable Entityを表す。422はバリデーションエラーを表す
    end
  end

  def login
    user = User.find_by(email: params[:email])
    p "params: #{params}"
    p "user: #{user}"
    p "params[:email]: #{params[:email]}"
    if user&.authenticate(params[:password]) # ぼっち演算子(x&.y)は、xがnilでない場合にのみメソッドyを呼び出し、xがnilの場合はnilを返す
      token = encode_token(user_id: user.id, exp: 24.hours.from_now.to_i)
      # token = encode_token({ user_id: user.id, exp: 5.seconds.from_now.to_i }) # JWTを生成
      render json: { user: user.as_json(except: :password_digest), token: token }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized # シンボルunauthorizedは401 Unauthorizedを表す
    end
  end

  def check
    render json: { is_logged_in: true }
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation) # requireはパラメーター(user(ここではJSON形式))が存在しない場合にエラーを返す。permitはuserの中のemail, name, password, password_confirmationを許可しそれ以外のプロパティは取り除く。結果のJSONがuser_paramsに格納されregisterメソッドに渡される
  end
end
