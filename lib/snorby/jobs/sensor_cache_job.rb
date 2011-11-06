# Snorby - All About Simplicity.
#
# Copyright (c) 2010 Dustin Willis Webber (dustin.webber at gmail.com)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

module Snorby
  module Jobs

    class SensorCacheJob < Struct.new(:verbose)

      include Snorby::Jobs::CacheHelper
      attr_accessor :events, :last_cache, :cache, :last_event

      def perform
        begin

          current_hour = DateTime.now.beginning_of_day + DateTime.now.hour.hours
          half_past_time = current_hour + 30.minutes

          if half_past_time < DateTime.now
            @stop_time = half_past_time
          else
            @stop_time = current_hour
          end

          Sensor.all.each do |sensor|
            @sensor = sensor

            logit "Looking for events..."
            @since_last_cache = since_last_cache

            if @since_last_cache.blank?
              if @sensor.cache.blank?

                current_hour = DateTime.now.beginning_of_day + DateTime.now.hour.hours
                half_past_time = current_hour + 30.minutes

                if half_past_time < DateTime.now
                  start_time = half_past_time
                else
                  start_time = current_hour
                end

              else
                start_time = @sensor.cache.last.ran_at + 30.minutes
              end

              Cache.create(:sid => @sensor.sid, :ran_at => start_time)
              next
            end

            # Prevent Duplicate Cache Records
            if @sensor.cache.blank?

              start_time = @since_last_cache.first.timestamp.beginning_of_day + 
                @since_last_cache.first.timestamp.hour.hours

              end_time = start_time + 30.minute
              next if start_time >= @stop_time
            else
              start_time = @sensor.cache.last.ran_at + 30.minute
              end_time = start_time + 30.minute
              next if start_time >= @stop_time
            end

            split_events_and_process(start_time, end_time)

          end

          Snorby::Jobs.sensor_cache.destroy! if Snorby::Jobs.sensor_cache?
          
          Delayed::Job.enqueue(Snorby::Jobs::SensorCacheJob.new(false), 
          :priority => 1, :run_at => @stop_time + 31.minute)

        rescue => e
          puts e
        rescue Interrupt
          @cache.destroy! if defined?(@cache)
        end
      end

      private

        def build_snorby_cache

          build_sensor_event_count
          build_proto_counts

          @cache.update({
                          :event_count => fetch_event_count,
                          :tcp_count => fetch_tcp_count,
                          :udp_count => fetch_udp_count,
                          :icmp_count => fetch_icmp_count,
                          :severity_metrics => fetch_severity_metrics,
                          :src_ips => fetch_src_ip_metrics,
                          :dst_ips => fetch_dst_ip_metrics,
                          :signature_metrics => fetch_signature_metrics
          })

          @cache
        end

        def since_last_cache
          return Event.all(:sid => @sensor.sid) if @sensor.cache.blank?
          @last_cache = @sensor.cache.last
          Event.all(:timestamp.gte => @last_cache.ran_at).all(:sid => @sensor.sid)
        end

        def reset_counter_cache_columns
          Severity.update!(:events_count => 0)
          Sensor.update!(:events_count => 0)
          Signature.update!(:events_count => 0)
        end

        #
        # Do to a stackerror with large collections we
        # need to first split the results into smaller
        # collections of 10000 then continue with the
        # cache calculations.
        #
        def split_events_and_process(start_time, end_time)

          return if start_time >= @stop_time

          all_events = @since_last_cache.between_time(start_time, end_time)

          @tcp_events = []
          @udp_events = []
          @icmp_events = []

          @last_event = all_events.last

          if all_events.blank?

            Cache.create(:sid => @sensor.sid, :ran_at => start_time)

          else

            if defined?(@last_cache)
              logit 'Found last cache...'
              @last_cache = @sensor.cache.last

              @cache = Cache.create(:sid => @last_event.sid, 
              :cid => @last_event.cid, :ran_at => start_time)

            else
              logit 'No cache records found - creating first cache record...'
              reset_counter_cache_columns
              
              @last_cache = Cache.create(:sid => @last_event.sid, 
              :cid => @last_event.cid, :ran_at => start_time)

              @cache = @last_cache
            end

            logit "\nNew Day: #{start_time} - #{end_time}", false
            logit "#{all_events.length} events found. Processing."

            records = []
            batch = 0

            all_events.each_chunk(BATCH_SIZE.to_i) do |chunk|
              @events = chunk
              
              logit "\nProcessing Batch #{batch += 1} of " + 
              "#{(all_events.length / BATCH_SIZE) + 1}...", false
              
              build_sensor_event_count
              build_proto_counts

              data = {
                :event_count => fetch_event_count,
                :tcp_count => fetch_tcp_count,
                :udp_count => fetch_udp_count,
                :icmp_count => fetch_icmp_count,
                :severity_metrics => fetch_severity_metrics,
                :src_ips => fetch_src_ip_metrics,
                :dst_ips => fetch_dst_ip_metrics,
                :signature_metrics => fetch_signature_metrics
              }

              records << data
            end

            if records.length > 1
              results = merged_records(records)
              @cache.update(results)
            else
              @cache.update(records.first)
            end
          end

          new_start_time = end_time
          new_end_time = end_time + 30.minutes

          split_events_and_process(new_start_time, new_end_time)

        end

    end

  end
end

