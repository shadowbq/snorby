module Snorby
  module Jobs
    class GeoipUpdateError < StandardError; end
    class GeoipUpdateFetchError < StandardError; end
    class GeoipUpdatedbJob < Struct.new(:verbose)
      
      include Snorby::Jobs::JobsHelper
      
      def perform
        logit "GeoIP Update Job Time: #{Time.now}", false
        logit "[~] Setting up GeopIP Dat File download\n", false
        
        uri = if Snorby::CONFIG.has_key?(:geoip_uri)
          URI(Snorby::CONFIG[:geoip_uri])
        else
          URI("http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz")
        end

        logit "[~] Fetching GeoIP : #{uri}\n", false
        begin
          resp = Net::HTTP.get_response(uri)
        rescue Timeout::Error, Errno::ETIMEDOUT, Errno::EINVAL, Errno::ECONNRESET, EOFError, Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError, Net::ProtocolError => e
          logit e.message, false
          logit "Something failed with fetching GeoipUpdate from : #{uri}", false
          raise GeoipUpdateFetchError, "Something failed with fetching GeoipUpdate from : #{uri}"
        rescue
          logit "Something failed with GeoipUpdate", false
          raise GeoipUpdateError, "Something failed with GeoipUpdate"  
        end
        
        gzip = lambda do |resp, file|
          gz = Zlib::GzipReader.new(StringIO.new(resp.body.to_s)) 
          file.write(gz.read)
        end

        normal = lambda do |resp, file|
          data = StringIO.new(resp.body.to_s)
          file.write(data.read)
        end
        
        logit "[~] Unzipping GeoIP Data file\n", false
        if resp.is_a?(Net::HTTPOK)
          open("tmp/tmp-snorby-geoip.dat", "wb") do |file|
            if uri.to_s.match(/.gz/)
              gzip.call(resp, file)
            else
              normal.call(resp, file)
            end
          end
        end

        logit "[~] Validating Data file\n", false
        
        if File.exists?("tmp/tmp-snorby-geoip.dat")
          FileUtils.mv('tmp/tmp-snorby-geoip.dat', 'config/snorby-geoip.dat', :force => true)
        end
        
        Snorby::Jobs.geoip_update.destroy! if Snorby::Jobs.geoip_update?
        
        logit "[~] Rescheduling GeoUpdate Job\n", false
        
        Delayed::Job.enqueue(Snorby::Jobs::GeoipUpdatedbJob.new(verbose), 
                               :priority => 1, 
                               :run_at => 1.week.from_now)
      rescue => e
        puts e
        puts e.backtrace
      end
    end
  end
end
