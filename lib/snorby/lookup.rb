require 'net/dns'
require 'net/dns/resolver'
require 'socket'
require 'whois'

module Snorby
  class Lookup
    
    Socket.do_not_reverse_lookup = false
    attr_accessor :address, :whois, :hostname, :dns
    
    def initialize(address)
      @address = address.to_s
    end
    
    def whois
      @whois ||= whois_lookup
    end
    
    def hostname
      @hostname ||= Socket::getaddrinfo(@address,nil)[0][2]
    end
    
    def dns
      @dns ||= Resolver(hostname)
    end
    
    private 
    
    def whois_lookup
      begin
        Whois::Client.new.query(@address) 
      rescue Timeout::Error
        "Timeout::Error - Could not reach Whois server(s) to query. Ensure that outbound tcp port 43 is open on your firewall."
      end
    end
    
  end
end
