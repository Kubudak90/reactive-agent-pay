// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ServiceRegistry
 * @notice Registry for AI agent services on Somnia
 * @dev Part of Reactive Agent Marketplace for Somnia Reactivity Hackathon
 */
contract ServiceRegistry {
    struct Service {
        bytes32 id;
        address provider;
        string name;
        string description;
        uint256 pricePerEvent;
        string[] eventTypes;
        bool active;
        uint256 createdAt;
    }

    mapping(bytes32 => Service) public services;
    mapping(address => bytes32[]) public providerServices;
    bytes32[] public allServiceIds;

    event ServiceRegistered(
        bytes32 indexed id,
        address indexed provider,
        string name,
        uint256 pricePerEvent
    );

    event ServiceUpdated(
        bytes32 indexed id,
        bool active,
        uint256 pricePerEvent
    );

    modifier onlyProvider(bytes32 serviceId) {
        require(services[serviceId].provider == msg.sender, "Not provider");
        _;
    }

    function registerService(
        string calldata name,
        string calldata description,
        uint256 pricePerEvent,
        string[] calldata eventTypes
    ) external returns (bytes32) {
        bytes32 id = keccak256(abi.encodePacked(msg.sender, name, block.timestamp));
        
        Service storage service = services[id];
        service.id = id;
        service.provider = msg.sender;
        service.name = name;
        service.description = description;
        service.pricePerEvent = pricePerEvent;
        service.eventTypes = eventTypes;
        service.active = true;
        service.createdAt = block.timestamp;

        providerServices[msg.sender].push(id);
        allServiceIds.push(id);

        emit ServiceRegistered(id, msg.sender, name, pricePerEvent);
        return id;
    }

    function updateService(
        bytes32 serviceId,
        bool active,
        uint256 pricePerEvent
    ) external onlyProvider(serviceId) {
        services[serviceId].active = active;
        services[serviceId].pricePerEvent = pricePerEvent;
        emit ServiceUpdated(serviceId, active, pricePerEvent);
    }

    function getService(bytes32 serviceId) external view returns (Service memory) {
        return services[serviceId];
    }

    function getProviderServices(address provider) external view returns (bytes32[] memory) {
        return providerServices[provider];
    }

    function getAllServices() external view returns (bytes32[] memory) {
        return allServiceIds;
    }
}
