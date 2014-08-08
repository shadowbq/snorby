module Snorby
  module Jobs
    class SensorDeleteJob < Struct.new(:sensor_id)

      include Snorby::Jobs::CacheHelper

      def perform
        delete_sensor(sensor_id) if sensor_id
      end

    end
  end
end
