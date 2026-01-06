import { Packet, NetworkState } from '../core/types';

export interface NetworkSimulationResult {
  packets: Packet[];
  states: NetworkState[];
  metrics: {
    throughput: number;
    retransmissionRate: number;
    effectiveBandwidth: number;
    totalPackets: number;
    lostPackets: number;
    retransmittedPackets: number;
  };
}

export class NetworkSimulator {
  static simulate(
    dataSize: number,
    packetLossRate: number,
    latency: number,
    windowSize: number = 4
  ): NetworkSimulationResult {
    const packets: Packet[] = [];
    const states: NetworkState[] = [];
    let sequenceNumber = 0;
    const ackNumber = 0;
    let connectionState: NetworkState['connectionState'] = 'CLOSED';
    let congestionWindow = 1;
    let ssthresh = 8;
    let time = 0;
    let totalPackets = 0;
    let lostPackets = 0;
    let retransmittedPackets = 0;

    // Connection establishment (3-way handshake)
    const synPacket: Packet = {
      id: `pkt-${totalPackets++}`,
      sequenceNumber: sequenceNumber++,
      type: 'SYN',
      timestamp: time++,
    };
    packets.push(synPacket);
    connectionState = 'SYN_SENT';
    states.push({
      connectionState,
      sentPackets: [synPacket],
      receivedPackets: [],
      congestionWindow,
      ssthresh,
    });

    const synAckPacket: Packet = {
      id: `pkt-${totalPackets++}`,
      sequenceNumber: sequenceNumber++,
      ackNumber: synPacket.sequenceNumber + 1,
      type: 'SYN-ACK',
      timestamp: time++,
    };
    packets.push(synAckPacket);
    connectionState = 'SYN_RECEIVED';
    states.push({
      connectionState,
      sentPackets: [synPacket],
      receivedPackets: [synAckPacket],
      congestionWindow,
      ssthresh,
    });

    const ackPacket: Packet = {
      id: `pkt-${totalPackets++}`,
      sequenceNumber: sequenceNumber++,
      ackNumber: synAckPacket.sequenceNumber + 1,
      type: 'ACK',
      timestamp: time++,
    };
    packets.push(ackPacket);
    connectionState = 'ESTABLISHED';
    states.push({
      connectionState,
      sentPackets: [synPacket, ackPacket],
      receivedPackets: [synAckPacket],
      congestionWindow,
      ssthresh,
    });

    // Data transfer
    const dataPackets: Packet[] = [];
    const unackedPackets: Packet[] = [];
    let nextSeqToSend = sequenceNumber;
    let lastAcked = ackPacket.sequenceNumber;

    for (let i = 0; i < dataSize; i++) {
      const shouldLose = Math.random() < packetLossRate;

      const dataPacket: Packet = {
        id: `pkt-${totalPackets++}`,
        sequenceNumber: nextSeqToSend++,
        ackNumber: lastAcked,
        type: 'DATA',
        data: `Data chunk ${i + 1}`,
        timestamp: time++,
        isLost: shouldLose,
      };

      if (shouldLose) {
        lostPackets++;
        dataPacket.isRetransmission = false;
      }

      dataPackets.push(dataPacket);
      unackedPackets.push(dataPacket);

      // Simulate ACK reception (with some delay)
      if (!shouldLose && Math.random() > 0.3) {
        const ack: Packet = {
          id: `pkt-${totalPackets++}`,
          sequenceNumber: lastAcked,
          ackNumber: dataPacket.sequenceNumber + 1,
          type: 'ACK',
          timestamp: time++,
        };
        packets.push(ack);
        lastAcked = ack.ackNumber!;

        // Remove acked packets
        const ackedIndex = unackedPackets.findIndex(p => p.sequenceNumber < ack.ackNumber!);
        if (ackedIndex !== -1) {
          unackedPackets.splice(0, ackedIndex + 1);
        }

        // Congestion control
        if (congestionWindow < ssthresh) {
          congestionWindow *= 2; // Slow start
        } else {
          congestionWindow += 1; // Congestion avoidance
        }
      } else if (shouldLose || unackedPackets.length >= windowSize) {
        // Retransmission timeout
        const oldestUnacked = unackedPackets[0];
        if (oldestUnacked) {
          const retransmit: Packet = {
            ...oldestUnacked,
            id: `pkt-${totalPackets++}`,
            isRetransmission: true,
            timestamp: time++,
          };
          packets.push(retransmit);
          retransmittedPackets++;
          ssthresh = Math.max(congestionWindow / 2, 2);
          congestionWindow = 1; // Reset to slow start
        }
      }

      states.push({
        connectionState,
        sentPackets: [...dataPackets],
        receivedPackets: packets.filter(p => p.type === 'ACK'),
        congestionWindow,
        ssthresh,
      });
    }

    packets.push(...dataPackets);

    // Connection termination
    const finPacket: Packet = {
      id: `pkt-${totalPackets++}`,
      sequenceNumber: nextSeqToSend++,
      type: 'FIN',
      timestamp: time++,
    };
    packets.push(finPacket);
    connectionState = 'FIN_WAIT';
    states.push({
      connectionState,
      sentPackets: [...packets.filter(p => ['SYN', 'DATA', 'FIN'].includes(p.type))],
      receivedPackets: packets.filter(p => ['SYN-ACK', 'ACK'].includes(p.type)),
      congestionWindow,
      ssthresh,
    });

    const finAck: Packet = {
      id: `pkt-${totalPackets++}`,
      sequenceNumber: lastAcked,
      ackNumber: finPacket.sequenceNumber + 1,
      type: 'ACK',
      timestamp: time++,
    };
    packets.push(finAck);
    connectionState = 'TIME_WAIT';
    states.push({
      connectionState,
      sentPackets: [...packets.filter(p => ['SYN', 'DATA', 'FIN'].includes(p.type))],
      receivedPackets: [...packets.filter(p => ['SYN-ACK', 'ACK'].includes(p.type)), finAck],
      congestionWindow,
      ssthresh,
    });

    const totalTime = time;
    const successfulPackets = totalPackets - lostPackets;
    const throughput = successfulPackets / totalTime;
    const retransmissionRate = retransmittedPackets / totalPackets;
    const effectiveBandwidth = (successfulPackets * 1000) / totalTime; // packets per second

    return {
      packets,
      states,
      metrics: {
        throughput: parseFloat(throughput.toFixed(4)),
        retransmissionRate: parseFloat((retransmissionRate * 100).toFixed(2)),
        effectiveBandwidth: parseFloat(effectiveBandwidth.toFixed(2)),
        totalPackets,
        lostPackets,
        retransmittedPackets,
      },
    };
  }
}
