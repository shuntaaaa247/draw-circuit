class Api::V1::CircuitElementsController < ApplicationController
  before_action :authenticate_user
  before_action :set_project

  def create
    element = @project.circuit_elements.build(element_params) # buildは新しいインスタンスを作成するメソッド
    if element.save
      render json: element.to_circuit_data, status: :created # シンボルcreatedは201 Createdを表す
    else
      render json: { errors: element.errors.full_messages }, status: :unprocessable_entity # シンボルunprocessable_entityは422 Unprocessable Entityを表す。422はバリデーションエラーを表す
    end
  end

  def update
    element = @project.circuit_elements.find(params[:id])
    if element.update(element_params)
      render json: element.to_circuit_data
    else
      render json: { errors: element.errors.full_messages }, status: :unprocessable_entity # シンボルunprocessable_entityは422 Unprocessable Entityを表す。422はバリデーションエラーを表す
    end
  end

  def destroy
    element = @project.circuit_elements.find(params[:id])
    element.destroy
    head :no_content # 204 No Contentを表す、ヘッダーのみを返す
  end

  private

  def set_project
    @project = current_user.projects.find(params[:project_id])
  end

  def element_params
    # クライアントから
    # {
    #   circuit_element: {
    #     element_type: "...",
    #     x_position: "...",
    #     y_position: "...",
    #   }
    # }
    # というJSONが送信された場合、params.require(:circuit_element).permit(:element_type, :x_position, :y_position, :width, :height, :rotation, properties: {})は
    # {
    #   element_type: "...",
    #   x_position: "...",
    #   y_position: "...",
    #   width: "...",
    #   height: "...",
    #   rotation: "...",
    #   properties: {
    #     "...": "...",
    #   }
    # }
    # というハッシュを返す
    params.require(:circuit_element).permit(:element_type, :x_position, :y_position, :width, :height, :rotation, properties: {})
    # properties: {}
    # → properties カラムが ハッシュ型（例えば JSON カラム） であることを想定している
    # → {} を書くことで「中身のキーは制限せずに全部許可する」という意味になる
  end
end
