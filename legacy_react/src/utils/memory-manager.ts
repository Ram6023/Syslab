import { PageFrame, PageReferenceEvent, MemoryResult, PageReplacementAlgorithm } from '../core/types';

export class MemoryManager {
  static simulate(
    pageReferences: number[],
    numFrames: number,
    algorithm: PageReplacementAlgorithm
  ): MemoryResult {
    switch (algorithm) {
      case 'FIFO':
        return this.fifo(pageReferences, numFrames);
      case 'LRU':
        return this.lru(pageReferences, numFrames);
      case 'OPTIMAL':
        return this.optimal(pageReferences, numFrames);
      default:
        return this.fifo(pageReferences, numFrames);
    }
  }

  private static fifo(pageReferences: number[], numFrames: number): MemoryResult {
    const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({
      pageNumber: null,
      lastUsed: -1,
      loadTime: -1,
    }));
    const events: PageReferenceEvent[] = [];
    let time = 0;
    let nextFrameIndex = 0;
    let pageFaults = 0;
    let pageHits = 0;

    for (const pageNumber of pageReferences) {
      const frameIndex = frames.findIndex(f => f.pageNumber === pageNumber);
      
      if (frameIndex !== -1) {
        // Page hit
        pageHits++;
        events.push({
          time,
          pageNumber,
          isHit: true,
          isFault: false,
        });
      } else {
        // Page fault
        pageFaults++;
        const evictedFrame = frames[nextFrameIndex];
        const evictedPage = evictedFrame.pageNumber;

        events.push({
          time,
          pageNumber,
          isHit: false,
          isFault: true,
          evictedPage: evictedPage ?? undefined,
          frameIndex: nextFrameIndex,
          reason: evictedPage !== null ? `FIFO: Evicted page ${evictedPage}` : 'FIFO: Empty frame',
        });

        frames[nextFrameIndex] = {
          pageNumber,
          lastUsed: time,
          loadTime: time,
        };

        nextFrameIndex = (nextFrameIndex + 1) % numFrames;
      }

      time++;
    }

    return {
      events,
      metrics: {
        pageFaults,
        pageHits,
        hitRatio: pageHits / pageReferences.length,
        faultRatio: pageFaults / pageReferences.length,
      },
    };
  }

  private static lru(pageReferences: number[], numFrames: number): MemoryResult {
    const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({
      pageNumber: null,
      lastUsed: -1,
      loadTime: -1,
    }));
    const events: PageReferenceEvent[] = [];
    let time = 0;
    let pageFaults = 0;
    let pageHits = 0;

    for (const pageNumber of pageReferences) {
      const frameIndex = frames.findIndex(f => f.pageNumber === pageNumber);
      
      if (frameIndex !== -1) {
        // Page hit - update last used
        pageHits++;
        frames[frameIndex].lastUsed = time;
        events.push({
          time,
          pageNumber,
          isHit: true,
          isFault: false,
        });
      } else {
        // Page fault
        pageFaults++;
        let replaceIndex = 0;
        
        // Find frame with oldest lastUsed
        const emptyFrameIndex = frames.findIndex(f => f.pageNumber === null);
        if (emptyFrameIndex !== -1) {
          replaceIndex = emptyFrameIndex;
        } else {
          replaceIndex = frames.reduce((minIndex, frame, index) => 
            frame.lastUsed < frames[minIndex].lastUsed ? index : minIndex, 0
          );
        }

        const evictedFrame = frames[replaceIndex];
        const evictedPage = evictedFrame.pageNumber;

        events.push({
          time,
          pageNumber,
          isHit: false,
          isFault: true,
          evictedPage: evictedPage ?? undefined,
          frameIndex: replaceIndex,
          reason: evictedPage !== null ? `LRU: Evicted page ${evictedPage} (least recently used)` : 'LRU: Empty frame',
        });

        frames[replaceIndex] = {
          pageNumber,
          lastUsed: time,
          loadTime: time,
        };
      }

      time++;
    }

    return {
      events,
      metrics: {
        pageFaults,
        pageHits,
        hitRatio: pageHits / pageReferences.length,
        faultRatio: pageFaults / pageReferences.length,
      },
    };
  }

  private static optimal(pageReferences: number[], numFrames: number): MemoryResult {
    const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({
      pageNumber: null,
      lastUsed: -1,
      loadTime: -1,
    }));
    const events: PageReferenceEvent[] = [];
    let time = 0;
    let pageFaults = 0;
    let pageHits = 0;

    for (let i = 0; i < pageReferences.length; i++) {
      const pageNumber = pageReferences[i];
      const frameIndex = frames.findIndex(f => f.pageNumber === pageNumber);
      
      if (frameIndex !== -1) {
        // Page hit
        pageHits++;
        events.push({
          time,
          pageNumber,
          isHit: true,
          isFault: false,
        });
      } else {
        // Page fault
        pageFaults++;
        let replaceIndex = 0;
        
        // Find empty frame first
        const emptyFrameIndex = frames.findIndex(f => f.pageNumber === null);
        if (emptyFrameIndex !== -1) {
          replaceIndex = emptyFrameIndex;
        } else {
          // Find page that will be used farthest in future (or never)
          let farthestUse = -1;
          for (let j = 0; j < frames.length; j++) {
            const framePage = frames[j].pageNumber!;
            const nextUse = pageReferences.slice(i + 1).findIndex(p => p === framePage);
            const useDistance = nextUse === -1 ? Infinity : nextUse;
            
            if (useDistance > farthestUse) {
              farthestUse = useDistance;
              replaceIndex = j;
            }
          }
        }

        const evictedFrame = frames[replaceIndex];
        const evictedPage = evictedFrame.pageNumber;

        events.push({
          time,
          pageNumber,
          isHit: false,
          isFault: true,
          evictedPage: evictedPage ?? undefined,
          frameIndex: replaceIndex,
          reason: evictedPage !== null ? `Optimal: Evicted page ${evictedPage} (used farthest in future)` : 'Optimal: Empty frame',
        });

        frames[replaceIndex] = {
          pageNumber,
          lastUsed: time,
          loadTime: time,
        };
      }

      time++;
    }

    return {
      events,
      metrics: {
        pageFaults,
        pageHits,
        hitRatio: pageHits / pageReferences.length,
        faultRatio: pageFaults / pageReferences.length,
      },
    };
  }
}
