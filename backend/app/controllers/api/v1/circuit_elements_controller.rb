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

  # 最新のcanvasデータを保存する(保存ボタンが押された時に実行される)
  def save_latest_circuit_elements_data
    ActiveRecord::Base.transaction do
      @project.circuit_elements.destroy_all
      
      params[:latest_circuit_elements_data].each do |element_data|
        @project.circuit_elements.create!(
          element_type: element_data[:element_type],
          x_position: element_data[:x_position],
          y_position: element_data[:y_position],
          start_x_position: element_data[:start_x_position],
          start_y_position: element_data[:start_y_position],
          end_x_position: element_data[:end_x_position],
          end_y_position: element_data[:end_y_position],
          width: element_data[:width],
          height: element_data[:height],
          rotation: element_data[:rotation],
          properties: element_data[:properties] || {}
        )
      end
    end
  
    render json: @project.circuit_elements, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
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
    #     start_x_position: "...",
    #     start_y_position: "...",
    #     end_x_position: "...",
    #     end_y_position: "...",
    #   }
    # }
    # というJSONが送信された場合、params.require(:circuit_element).permit(:element_type, :x_position, :y_position, :start_x_position, :start_y_position, :end_x_position, :end_y_position, :width, :height, :rotation, properties: {})は
    # {
    #   element_type: "...",
    #   x_position: "...",
    #   y_position: "...",
    #   start_x_position: "...",
    #   start_y_position: "...",
    #   end_x_position: "...",
    #   end_y_position: "...",
    #   width: "...",
    #   height: "...",
    #   rotation: "...",
    #   properties: {
    #     "...": "...",
    #   }
    # }
    # というハッシュを返す
    params.require(:circuit_element).permit(:element_type, :x_position, :y_position, :start_x_position, :start_y_position, :end_x_position, :end_y_position, :width, :height, :rotation, properties: {})
    # properties: {}
    # → properties カラムが ハッシュ型（例えば JSON カラム） であることを想定している
    # → {} を書くことで「中身のキーは制限せずに全部許可する」という意味になる
  end
end
