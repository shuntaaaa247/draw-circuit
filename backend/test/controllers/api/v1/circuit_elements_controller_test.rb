require "test_helper"

class Api::V1::CircuitElementsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_circuit_elements_create_url
    assert_response :success
  end

  test "should get update" do
    get api_v1_circuit_elements_update_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_circuit_elements_destroy_url
    assert_response :success
  end
end
