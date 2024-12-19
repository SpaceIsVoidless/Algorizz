const algorithms = [
    { name: 'Bubble Sort', function: bubbleSort },
    { name: 'Selection Sort', function: selectionSort },
    { name: 'Insertion Sort', function: insertionSort },
    { name: 'Merge Sort', function: mergeSort },
    { name: 'Quick Sort', function: quickSort },
    { name: 'Dijkstra', function: dijkstra },
    { name: 'KMP Search', function: kmpSearch },
    { name: 'Binary Search', function: binarySearch },
    { name: 'Tower of Hanoi', function: towerOfHanoi },
    { name: 'Knapsack', function: knapsack },
    { name: 'Stack', function: stackVisualizer },
    { name: 'Queue', function: queueVisualizer },
    { name: 'Bubble Sort Array', function: bubbleSortArray },
    { name: 'DFS', function: dfsVisualization }
];

let currentAlgorithm = null;
let sorting = false;
let currentStep = 0;
let animationSpeed = 500; // Default speed in milliseconds

function initializeAlgorithmButtons() {
    const container = document.getElementById('algorithm-buttons');
    container.className = 'algorithm-list';
    
    // Shuffle algorithms array
    const shuffledAlgorithms = [...algorithms].sort(() => Math.random() - 0.5);
    
    shuffledAlgorithms.forEach(algo => {
        const card = document.createElement('div');
        card.className = 'algorithm-card p-4 mb-4';
        card.onclick = () => selectAlgorithm(algo);

        const thumbnail = document.createElement('div');
        thumbnail.className = 'algorithm-thumbnail mb-3';
        thumbnail.innerHTML = createSortingThumbnail(algo.name);

        const title = document.createElement('h3');
        title.className = 'text-lg font-bold text-center';
        title.textContent = algo.name;

        card.appendChild(thumbnail);
        card.appendChild(title);
        container.appendChild(card);
    });
}

function selectAlgorithm(algo) {
    currentAlgorithm = algo;
    resetVisualization();
    algo.function();
}

function resetVisualization() {
    const container = document.getElementById('algorithm-container');
    container.className = '';  // Clear all classes
    container.innerHTML = '';
    sorting = false;
    currentStep = 0;
    updateStepCounter();
}

// Add this function to handle full-screen changes
function handleFullScreenChange() {
    const container = document.getElementById('algorithm-container');
    const existingDial = container.querySelector('.speed-dial-container');
    const currentAlgorithm = container.querySelector('.heap-container');
    
    if (document.fullscreenElement) {
        // Only add speed dial when it's not heap sort
        if (!currentAlgorithm && !existingDial) {
            const visualizationContainer = container.querySelector('.flex-1');
            visualizationContainer.appendChild(createSpeedDial());
        }
    } else {
        // Remove speed dial when exiting full-screen
        if (existingDial) {
            existingDial.remove();
        }
    }
}

// Modify the toggleFullScreen function
function toggleFullScreen(container) {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Add event listeners for full-screen changes
document.addEventListener('fullscreenchange', handleFullScreenChange);

// Then modify the createControlButtons function to add the full-screen button
function createControlButtons(startFunction, resetFunction, generateFunction, isKMP = false) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center gap-4 mt-4';

    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.className = 'bg-green-500 text-white px-4 py-2 rounded-full';
    startButton.onclick = startFunction;

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.className = 'bg-red-500 text-white px-4 py-2 rounded-full';
    resetButton.onclick = resetFunction;

    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Random';
    generateButton.className = 'bg-blue-500 text-white px-4 py-2 rounded-full';
    generateButton.onclick = generateFunction;

    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(generateButton);

    // Only add full-screen button if not KMP
    if (!isKMP) {
        const fullScreenButton = document.createElement('button');
        fullScreenButton.innerHTML = '⛶';
        fullScreenButton.className = 'fullscreen-button';
        fullScreenButton.onclick = () => toggleFullScreen(document.getElementById('algorithm-container'));

        const algorithmContainer = document.getElementById('algorithm-container');
        algorithmContainer.appendChild(fullScreenButton);
    }

    return buttonContainer;
}

function updateStepCounter() {
    const stepCounter = document.getElementById('step-counter');
    if (stepCounter) {
        stepCounter.querySelector('span:last-child').textContent = currentStep;
    }
}

function resetStepCounter() {
    currentStep = 0;
    updateStepCounter();
}

function bubbleSort() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1 max-w-[2705px] relative">  <!-- Added relative positioning -->
                <h2 class="text-2xl font-bold mb-4">Bubble Sort</h2>
                <div class="input-container mb-4">
                    <input type="text" value="64, 34, 25, 12, 22, 11, 90" 
                           placeholder="Enter numbers separated by commas"
                           class="w-full max-w-[1732px]">
                </div>
                <div id="array-container" class="flex items-end justify-center h-64 mb-8"></div>
                <div class="controls-container flex gap-2"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <!-- Right side: Algorithm Explanation -->
            ${createAlgorithmExplanation('Bubble Sort')}
        </div>
    `;
    
    // Get references to the containers
    const input = container.querySelector('.input-container input');
    const arrayContainer = document.getElementById('array-container');
    const controlsContainer = container.querySelector('.controls-container');

    function generateArray() {
        const inputValue = input.value.trim();
        let array;
        if (inputValue) {
            array = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        } else {
            array = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
        }
        
        input.value = array.join(', ');
        
        arrayContainer.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 2}px`;
            bar.textContent = value;
            arrayContainer.appendChild(bar);
        });
    }

    generateArray();
    input.addEventListener('change', generateArray);

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startBubbleSort,
        () => selectAlgorithm({name: 'Bubble Sort', function: bubbleSort}),
        () => {
            input.value = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1).join(', ');
            generateArray();
        }
    ));

    async function startBubbleSort() {
        if (sorting) return;
        sorting = true;
        currentStep = 0;  // Reset step counter
        updateStepCounter();
        
        const bars = arrayContainer.children;
        let i = 0;
        let j = 0;

        function bubbleSortStep() {
            if (i < bars.length - 1) {
                if (j < bars.length - i - 1) {
                    const value1 = parseInt(bars[j].textContent);
                    const value2 = parseInt(bars[j + 1].textContent);
                    
                    // Remove previous highlighting
                    Array.from(bars).forEach(bar => bar.classList.remove('swapping'));
                    
                    // Highlight current comparison
                    bars[j].classList.add('swapping');
                    bars[j + 1].classList.add('swapping');
                    
                    if (value1 > value2) {
                        // Swap bars with animation
                        const bar1 = bars[j];
                        const bar2 = bars[j + 1];
                        
                        // Store original positions
                        const rect1 = bar1.getBoundingClientRect();
                        const rect2 = bar2.getBoundingClientRect();
                        
                        // Calculate the distance to move
                        const distance = rect2.left - rect1.left;
                        
                        // Animate the swap
                        gsap.to(bar1, {
                            x: distance,
                            duration: animationSpeed / 1000,
                            ease: "power2.inOut"
                        });
                        
                        gsap.to(bar2, {
                            x: -distance,
                            duration: animationSpeed / 1000,
                            ease: "power2.inOut",
                            onComplete: () => {
                                // Reset positions and update DOM
                                gsap.set([bar1, bar2], { x: 0 });
                                arrayContainer.insertBefore(bar2, bar1);
                            }
                        });
                    }
                    
                    j++;
                    currentStep++;
                    updateStepCounter();
                    setTimeout(bubbleSortStep, animationSpeed);
                } else {
                    j = 0;
                    i++;
                    setTimeout(bubbleSortStep, animationSpeed);
                }
            } else {
                sorting = false;
                // Remove highlighting when done
                Array.from(bars).forEach(bar => bar.classList.remove('swapping'));
            }
        }

        bubbleSortStep();
    }
}

function insertionSort() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1 max-w-[2705px]">
                <h2 class="text-2xl font-bold mb-4">Insertion Sort</h2>
                <div class="input-container mb-4">
                    <input type="text" value="64, 34, 25, 12, 22, 11, 90" 
                           placeholder="Enter numbers separated by commas"
                           class="w-full max-w-[1732px]">
                </div>
                <div id="array-container" class="flex items-end justify-center h-64 mb-8"></div>
                <div class="controls-container flex gap-2"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <!-- Right side: Algorithm Explanation -->
            <div class="flex-1 algorithm-explanation">
                <h3>Insertion Sort Algorithm</h3>
                <p>Insertion Sort builds the final sorted array one item at a time. It takes each element from the unsorted part and inserts it into its correct position in the sorted part.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Start with first element as sorted array</li>
                    <li>Take next element and insert it into sorted array</li>
                    <li>Repeat until all elements are sorted</li>
                    <li>Each iteration expands sorted array by one</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(n²)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(1)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
    function insertionSort(arr):
        for i from 1 to length(arr)-1:
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j+1] = arr[j]
                j = j - 1
            arr[j+1] = key</pre>
                </div>
            </div>
        </div>
    `;

    // Get references to the containers
    const input = container.querySelector('.input-container input');
    const arrayContainer = document.getElementById('array-container');
    const controlsContainer = container.querySelector('.controls-container');

    function generateArray() {
        const inputValue = input.value.trim();
        let array;
        if (inputValue) {
            array = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        } else {
            array = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
        }
        
        input.value = array.join(', ');
        
        arrayContainer.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 2}px`;
            bar.textContent = value;
            arrayContainer.appendChild(bar);
        });
    }

    generateArray();
    input.addEventListener('change', generateArray);

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startInsertionSort,
        () => selectAlgorithm({name: 'Insertion Sort', function: insertionSort}),
        () => {
            input.value = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1).join(', ');
            generateArray();
        }
    ));

    async function startInsertionSort() {
        if (sorting) return;
        sorting = true;
        currentStep = 0;  // Reset step counter
        updateStepCounter();
        
        const bars = arrayContainer.children;
        for (let i = 1; i < bars.length; i++) {
            const key = parseInt(bars[i].textContent);
            const keyHeight = bars[i].style.height;
            let j = i - 1;

            function compareStep() {
                if (j >= 0 && parseInt(bars[j].textContent) > key) {
                    bars[j + 1].textContent = bars[j].textContent;
                    bars[j + 1].style.height = bars[j].style.height;
                    j--;
                    currentStep++;
                    updateStepCounter();
                    setTimeout(compareStep, 100);
                } else {
                    bars[j + 1].textContent = key;
                    bars[j + 1].style.height = keyHeight;
                    i++;
                    setTimeout(startInsertionSort, 100);
                }
            }

            compareStep();
        }
        
        sorting = false;
    }
}

function mergeSort() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1 max-w-[2705px]">
                <h2 class="text-2xl font-bold mb-4">Merge Sort</h2>
                <div class="input-container mb-4">
                    <input type="text" value="64, 34, 25, 12, 22, 11, 90" 
                           placeholder="Enter numbers separated by commas"
                           class="w-full max-w-[1732px]">
                </div>
                <div id="array-container" class="flex items-end justify-center h-64 mb-8"></div>
                <div class="controls-container flex gap-2"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>

            <!-- Right side: Algorithm Explanation -->
            ${createAlgorithmExplanation('Merge Sort')}
        </div>
    `;

    // Get references to the containers
    const input = container.querySelector('.input-container input');
    const arrayContainer = document.getElementById('array-container');
    const controlsContainer = container.querySelector('.controls-container');

    function generateArray() {
        const inputValue = input.value.trim();
        let array;
        if (inputValue) {
            array = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        } else {
            array = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
        }
        
        input.value = array.join(', ');
        
        arrayContainer.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 2}px`;
            bar.textContent = value;
            arrayContainer.appendChild(bar);
        });
    }

    generateArray();
    input.addEventListener('change', generateArray);

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startMergeSort,
        () => selectAlgorithm({name: 'Merge Sort', function: mergeSort}),
        () => {
            input.value = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1).join(', ');
            generateArray();
        }
    ));

    async function startMergeSort() {
        if (sorting) return;
        sorting = true;
        const bars = arrayContainer.children;
        const values = Array.from(bars).map(bar => parseInt(bar.textContent));
        
        async function merge(start, middle, end) {
            const leftArray = values.slice(start, middle + 1);
            const rightArray = values.slice(middle + 1, end + 1);
            
            let i = 0, j = 0, k = start;
            
            while (i < leftArray.length && j < rightArray.length) {
                bars[k].classList.add('swapping');
                await new Promise(resolve => setTimeout(resolve, 100));
                
                if (leftArray[i] <= rightArray[j]) {
                    values[k] = leftArray[i];
                    bars[k].style.height = `${leftArray[i] * 2}px`;
                    bars[k].textContent = leftArray[i];
                    i++;
                } else {
                    values[k] = rightArray[j];
                    bars[k].style.height = `${rightArray[j] * 2}px`;
                    bars[k].textContent = rightArray[j];
                    j++;
                }
                
                bars[k].classList.remove('swapping');
                k++;
                currentStep++;
                updateStepCounter();
            }
            
            while (i < leftArray.length) {
                bars[k].classList.add('swapping');
                await new Promise(resolve => setTimeout(resolve, 100));
                
                values[k] = leftArray[i];
                bars[k].style.height = `${leftArray[i] * 2}px`;
                bars[k].textContent = leftArray[i];
                
                bars[k].classList.remove('swapping');
                i++;
                k++;
                currentStep++;
                updateStepCounter();
            }
            
            while (j < rightArray.length) {
                bars[k].classList.add('swapping');
                await new Promise(resolve => setTimeout(resolve, 100));
                
                values[k] = rightArray[j];
                bars[k].style.height = `${rightArray[j] * 2}px`;
                bars[k].textContent = rightArray[j];
                
                bars[k].classList.remove('swapping');
                j++;
                k++;
                currentStep++;
                updateStepCounter();
            }
        }
        
        async function mergeSortRecursive(start, end) {
            if (start < end) {
                const middle = Math.floor((start + end) / 2);
                await mergeSortRecursive(start, middle);
                await mergeSortRecursive(middle + 1, end);
                await merge(start, middle, end);
            }
        }
        
        await mergeSortRecursive(0, values.length - 1);
        sorting = false;
    }
}

function quickSort() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1 max-w-[2705px]">
                <h2 class="text-2xl font-bold mb-4">Quick Sort</h2>
                <div class="input-container mb-4">
                    <input type="text" value="64, 34, 25, 12, 22, 11, 90" 
                           placeholder="Enter numbers separated by commas"
                           class="w-full max-w-[1732px]">
                </div>
                <div id="array-container" class="flex items-end justify-center h-64 mb-8"></div>
                <div class="controls-container flex gap-2"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <!-- Right side: Algorithm Explanation -->
            <div class="flex-1 algorithm-explanation">
                <h3>Quick Sort Algorithm</h3>
                <p>Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Choose a pivot element from the array</li>
                    <li>Partition elements: less than pivot to left, greater to right</li>
                    <li>Recursively apply the same steps to sub-arrays</li>
                    <li>Combine the sorted sub-arrays</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(n log n)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(log n)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
    function quickSort(arr, low, high):
        if low < high:
            pivot = partition(arr, low, high)
            quickSort(arr, low, pivot - 1)
            quickSort(arr, pivot + 1, high)
            
    function partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j from low to high - 1:
            if arr[j] <= pivot:
                i++
                swap(arr[i], arr[j])
        swap(arr[i + 1], arr[high])
        return i + 1</pre>
                </div>
            </div>
        </div>
    `;

    // Get references to the containers
    const input = container.querySelector('.input-container input');
    const arrayContainer = document.getElementById('array-container');
    const controlsContainer = container.querySelector('.controls-container');

    function generateArray() {
        const inputValue = input.value.trim();
        let array;
        if (inputValue) {
            array = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        } else {
            array = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
        }
        
        input.value = array.join(', ');
        
        arrayContainer.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 2}px`;
            bar.textContent = value;
            arrayContainer.appendChild(bar);
        });
    }

    generateArray();
    input.addEventListener('change', generateArray);

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startQuickSort,
        () => selectAlgorithm({name: 'Quick Sort', function: quickSort}),
        () => {
            input.value = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1).join(', ');
            generateArray();
        }
    ));

    async function startQuickSort() {
        if (sorting) return;
        sorting = true;
        const bars = arrayContainer.children;
        
        async function swap(i, j) {
            const bar1 = bars[i];
            const bar2 = bars[j];
            
            const rect1 = bar1.getBoundingClientRect();
            const rect2 = bar2.getBoundingClientRect();
            const distance = rect2.left - rect1.left;
            
            bar1.classList.add('swapping');
            bar2.classList.add('swapping');
            
            await Promise.all([
                new Promise(resolve => {
                    gsap.to(bar1, {
                        x: distance,
                        duration: animationSpeed / 1000, // Convert to seconds for GSAP
                        ease: "power2.inOut",
                        onComplete: resolve
                    });
                }),
                new Promise(resolve => {
                    gsap.to(bar2, {
                        x: -distance,
                        duration: animationSpeed / 1000, // Convert to seconds for GSAP
                        ease: "power2.inOut",
                        onComplete: resolve
                    });
                })
            ]);
            
            gsap.set([bar1, bar2], { x: 0 });
            arrayContainer.insertBefore(bar2, bar1);
            arrayContainer.insertBefore(bar1, bars[j]);
            
            bar1.classList.remove('swapping');
            bar2.classList.remove('swapping');
            
            currentStep++;
            updateStepCounter();
        }
        
        async function partition(low, high) {
            const pivot = parseInt(bars[high].textContent);
            let i = low - 1;
            
            bars[high].style.backgroundColor = '#ff0055';
            
            for (let j = low; j < high; j++) {
                const current = parseInt(bars[j].textContent);
                if (current < pivot) {
                    i++;
                    if (i !== j) {
                        await swap(i, j);
                    }
                }
            }
            
            if (i + 1 !== high) {
                await swap(i + 1, high);
            }
            
            bars[high].style.backgroundColor = '';
            return i + 1;
        }
        
        async function quickSortRecursive(low, high) {
            if (low < high) {
                const pi = await partition(low, high);
                await quickSortRecursive(low, pi - 1);
                await quickSortRecursive(pi + 1, high);
            }
        }
        
        await quickSortRecursive(0, bars.length - 1);
        sorting = false;
    }
}

function initializeSpeedControl() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.querySelector('.speed-value');
    
    function updateSpeed() {
        const speeds = {
            1: { text: 'Very Slow', value: 1000 },
            2: { text: 'Slow', value: 750 },
            3: { text: 'Normal', value: 500 },
            4: { text: 'Fast', value: 250 },
            5: { text: 'Very Fast', value: 100 }
        };
        
        const speed = speeds[speedSlider.value];
        speedValue.textContent = speed.text;
        animationSpeed = speed.value;
    }
    
    speedSlider.addEventListener('input', updateSpeed);
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        updateThemeIcon();
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });
    
    function updateThemeIcon() {
        const isLight = body.classList.contains('light-theme');
        themeToggle.innerHTML = isLight ? 
            '<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>' :
            '<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>';
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('light-theme', savedTheme === 'light');
        updateThemeIcon();
    }
}

function avlTree() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = '<h2 class="text-2xl font-bold mb-4">AVL Tree</h2>';

    // Create SVG container
    const width = 800;
    const height = 500;
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2},50)`);

    // Define gradient for nodes
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'node-gradient')
        .attr('gradientTransform', 'rotate(90)');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#00fff5');

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#0096ff');

    class AVLNode {
        constructor(value) {
            this.value = value;
            this.height = 1;
            this.left = null;
            this.right = null;
        }
    }

    let root = null;

    function getHeight(node) {
        return node ? node.height : 0;
    }

    function getBalance(node) {
        return node ? getHeight(node.left) - getHeight(node.right) : 0;
    }

    function updateHeight(node) {
        node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }

    async function rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        updateHeight(y);
        updateHeight(x);

        return x;
    }

    async function rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        updateHeight(x);
        updateHeight(y);

        return y;
    }

    async function insert(node, value) {
        if (!node) {
            return new AVLNode(value);
        }

        if (value < node.value) {
            node.left = await insert(node.left, value);
        } else if (value > node.value) {
            node.right = await insert(node.right, value);
        } else {
            return node;
        }

        updateHeight(node);

        const balance = getBalance(node);

        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            return await rotateRight(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            return await rotateLeft(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = await rotateLeft(node.left);
            return await rotateRight(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = await rotateRight(node.right);
            return await rotateLeft(node);
        }

        return node;
    }

    function renderTree() {
        const treeLayout = d3.tree().size([width - 100, height - 100]);
        const root = d3.hierarchy(convertToD3Format(root));
        const treeData = treeLayout(root);

        // Update links
        const links = svg.selectAll('.link')
            .data(treeData.links(), d => d.target.data.id);

        links.enter()
            .append('path')
            .attr('class', 'link')
            .merge(links)
            .transition()
            .duration(500)
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y));

        links.exit().remove();

        // Update nodes
        const nodes = svg.selectAll('.node')
            .data(treeData.descendants(), d => d.data.id);

        const nodesEnter = nodes.enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        nodesEnter.append('circle')
            .attr('r', 20);

        nodesEnter.append('text')
            .text(d => d.data.value);

        nodes.transition()
            .duration(500)
            .attr('transform', d => `translate(${d.x},${d.y})`);

        nodes.exit().remove();
    }

    function convertToD3Format(node) {
        if (!node) return null;
        return {
            value: node.value,
            id: Math.random(), // Unique ID for D3 transitions
            children: [
                convertToD3Format(node.left),
                convertToD3Format(node.right)
            ].filter(Boolean)
        };
    }

    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                root = await insert(root, value);
                renderTree();
                input.value = '';
                currentStep++;
                updateStepCounter();
            }
        }
    });

    container.appendChild(createControlButtons(
        null,
        () => {
            root = null;
            renderTree();
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            root = null;
            const values = Array.from({length: 5}, () => Math.floor(Math.random() * 100) + 1);
            values.forEach(async (value) => {
                root = await insert(root, value);
                renderTree();
                currentStep++;
                updateStepCounter();
            });
        }
    ));
}

function dijkstra() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="dijkstra-container">
            <div class="flex-1 max-w-[2705px] relative">
                <h2 class="text-2xl font-bold mb-4">Dijkstra's Algorithm</h2>
                <div class="grid-container" style="display: grid; gap: 1px; background: rgba(255, 255, 255, 0.1);"></div>
                <div class="controls-container flex gap-2 mt-4"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <!-- Algorithm Explanation (below by default, right side in fullscreen) -->
            <div class="flex-1 algorithm-explanation dijkstra-explanation">
                <h3>Dijkstra's Algorithm</h3>
                <p>Dijkstra's algorithm finds the shortest path between nodes in a weighted graph.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Mark all nodes unvisited and store them</li>
                    <li>Set the distance to zero for initial node</li>
                    <li>Set the distance to infinity for other nodes</li>
                    <li>Visit the unvisited node with the smallest distance</li>
                    <li>Update the distance for all adjacent nodes</li>
                    <li>Mark the current node as visited</li>
                    <li>Repeat until all nodes are visited</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O((V + E) log V)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(V)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
    function dijkstra(graph, source):
        dist[source] = 0
        for each vertex v in graph:
            if v ≠ source:
                dist[v] = infinity
            add v to unvisited
            
        while unvisited is not empty:
            u = vertex in unvisited with min dist[]
            remove u from unvisited
            
            for each neighbor v of u:
                alt = dist[u] + length(u, v)
                if alt < dist[v]:
                    dist[v] = alt
                    prev[v] = u</pre>
                </div>
            </div>
        </div>
    `;

    const gridContainer = container.querySelector('.grid-container');
    const controlsContainer = container.querySelector('.controls-container');
    const GRID_SIZE = 15;
    let startCell = null;
    let endCell = null;
    let isDrawingWalls = false;

    // Set up grid
    gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 30px)`;
    const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    
    // Create grid cells
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('mousedown', () => {
                if (!startCell) {
                    startCell = { row: i, col: j };
                    cell.classList.add('start');
                } else if (!endCell) {
                    endCell = { row: i, col: j };
                    cell.classList.add('end');
                } else {
                    isDrawingWalls = true;
                    toggleWall(cell, i, j);
                }
            });

            cell.addEventListener('mouseover', () => {
                if (isDrawingWalls) {
                    toggleWall(cell, i, j);
                }
            });

            gridContainer.appendChild(cell);
        }
    }

    function toggleWall(cell, i, j) {
        if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
            cell.classList.toggle('wall');
            grid[i][j] = cell.classList.contains('wall') ? 1 : 0;
        }
    }

    document.addEventListener('mouseup', () => {
        isDrawingWalls = false;
    });

    // Add control buttons with full-screen support
    controlsContainer.appendChild(createControlButtons(
        findPath,
        resetGrid,
        () => {
            resetGrid();
            generateRandomWalls();
        }
    ));

    function resetGrid() {
        startCell = null;
        endCell = null;
        grid.forEach(row => row.fill(0));
        Array.from(gridContainer.children).forEach(cell => {
            cell.className = 'grid-cell';
        });
        currentStep = 0;
        updateStepCounter();
    }

    function generateRandomWalls() {
        const wallCount = Math.floor(GRID_SIZE * GRID_SIZE * 0.3);
        for (let i = 0; i < wallCount; i++) {
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);
            const cell = gridContainer.children[row * GRID_SIZE + col];
            if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('wall');
                grid[row][col] = 1;
            }
        }
    }

    async function findPath() {
        if (!startCell || !endCell) {
            alert('Please set start and end points first');
            return;
        }

        // Clear previous path
        const cells = Array.from(gridContainer.children);
        cells.forEach(cell => {
            if (!cell.classList.contains('wall') && 
                !cell.classList.contains('start') && 
                !cell.classList.contains('end')) {
                cell.classList.remove('visited', 'path');
            }
        });

        const distances = {};
        const previous = {};
        const unvisited = new Set();
        const visited = new Set();

        // Initialize distances
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const key = `${i},${j}`;
                distances[key] = Infinity;
                unvisited.add(key);
            }
        }

        distances[`${startCell.row},${startCell.col}`] = 0;
        let pathFound = false;
        currentStep = 0;
        updateStepCounter();

        while (unvisited.size > 0) {
            let minDist = Infinity;
            let current = null;
            
            for (const node of unvisited) {
                if (distances[node] < minDist) {
                    minDist = distances[node];
                    current = node;
                }
            }

            if (!current || distances[current] === Infinity) {
                alert('No path found to destination!');
                return;
            }

            const [row, col] = current.split(',').map(Number);
            if (row === endCell.row && col === endCell.col) {
                pathFound = true;
                break;
            }

            unvisited.delete(current);
            visited.add(current);

            // Visualize visited cell
            const cell = cells[row * GRID_SIZE + col];
            if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('visited');
                currentStep++;
                updateStepCounter();
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
            }

            // Check neighbors
            const neighbors = [
                [row - 1, col], [row + 1, col],
                [row, col - 1], [row, col + 1]
            ];

            for (const [r, c] of neighbors) {
                if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && 
                    !visited.has(`${r},${c}`) && grid[r][c] !== 1) {
                    const newDist = distances[current] + 1;
                    if (newDist < distances[`${r},${c}`]) {
                        distances[`${r},${c}`] = newDist;
                        previous[`${r},${c}`] = current;
                    }
                }
            }
        }

        if (!pathFound) {
            alert('No path found to destination!');
            return;
        }

        // Reconstruct and visualize path
        let current = `${endCell.row},${endCell.col}`;
        const path = [];
        while (previous[current]) {
            path.unshift(current);
            current = previous[current];
        }

        for (const node of path) {
            const [row, col] = node.split(',').map(Number);
            const cell = cells[row * GRID_SIZE + col];
            if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('path');
                currentStep++;
                updateStepCounter();
                await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            }
        }
    }
}

function createSortingThumbnail(algorithmName) {
    switch (algorithmName) {
        case 'Bubble Sort':
            return `
                <div class="thumbnail-container">
                    <div class="bubble-thumbnail">
                        ${Array.from({length: 4}, () => `
                            <div class="bubble">
                                <div class="bubble-inner"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
        case 'Stack':
            return `
                <div class="thumbnail-container">
                    <div class="stack-thumbnail">
                        ${Array.from({length: 3}, (_, i) => `
                            <div class="stack-layer" style="transform: translateY(${i * -5}px)"></div>
                        `).join('')}
                    </div>
                </div>
            `;
            
        case 'Queue':
            return `
                <div class="thumbnail-container">
                    <div class="queue-thumbnail">
                        <div class="queue-arrow"></div>
                        ${Array.from({length: 3}, () => `
                            <div class="queue-item"></div>
                        `).join('')}
                    </div>
                </div>
            `;
            
        case 'Binary Search':
            return `
                <div class="thumbnail-container">
                    <div class="binary-thumbnail">
                        <div class="binary-tree">
                            <div class="node root"></div>
                            <div class="level-2">
                                <div class="node"></div>
                                <div class="node"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case 'Tower of Hanoi':
            return `
                <div class="thumbnail-container">
                    <div class="hanoi-thumbnail">
                        ${Array.from({length: 3}, (_, i) => `
                            <div class="tower">
                                <div class="disc" style="width: ${40 - i * 10}px"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        case 'Selection Sort':
            return `
                <div class="thumbnail-container">
                    <div class="selection-thumbnail">
                        <div class="selection-array">
                            ${Array.from({length: 5}, () => `
                                <div class="selection-element" style="height: ${Math.random() * 30 + 10}px"></div>
                            `).join('')}
                        </div>
                        <div class="selection-pointer"></div>
                    </div>
                </div>
            `;

        case 'Insertion Sort':
            return `
                <div class="thumbnail-container">
                    <div class="insertion-thumbnail">
                        ${Array.from({length: 4}, (_, i) => `
                            <div class="insertion-card" style="transform: translateX(${i * -10}px)">
                                <span>${Math.floor(Math.random() * 90 + 10)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        case 'Merge Sort':
            return `
                <div class="thumbnail-container">
                    <div class="merge-thumbnail">
                        <div class="merge-tree">
                            <div class="merge-level-1"></div>
                            <div class="merge-level-2">
                                <div></div>
                                <div></div>
                            </div>
                            <div class="merge-level-3">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 'Quick Sort':
            return `
                <div class="thumbnail-container">
                    <div class="quick-thumbnail">
                        <div class="pivot"></div>
                        <div class="partition">
                            <div class="less-than"></div>
                            <div class="greater-than"></div>
                        </div>
                    </div>
                </div>
            `;

        case 'Dijkstra':
            return `
                <div class="thumbnail-container">
                    <div class="dijkstra-thumbnail">
                        <div class="grid-mini">
                            ${Array.from({length: 16}, () => 
                                `<div class="grid-cell ${Math.random() > 0.8 ? 'wall' : ''}"></div>`
                            ).join('')}
                        </div>
                        <div class="path-marker"></div>
                    </div>
                </div>
            `;

        case 'KMP Search':
            return `
                <div class="thumbnail-container">
                    <div class="kmp-thumbnail">
                        <div class="pattern">
                            ${Array.from({length: 4}, () => 
                                `<div class="pattern-char">${String.fromCharCode(65 + Math.floor(Math.random() * 26))}</div>`
                            ).join('')}
                        </div>
                        <div class="text">
                            ${Array.from({length: 6}, () => 
                                `<div class="text-char">${String.fromCharCode(65 + Math.floor(Math.random() * 26))}</div>`
                            ).join('')}
                        </div>
                        <div class="kmp-pointer"></div>
                    </div>
                </div>
            `;

        case 'Binary Search':
            return `
                <div class="thumbnail-container">
                    <div class="binary-thumbnail">
                        <div class="binary-tree">
                            <div class="node root"></div>
                            <div class="level-2">
                                <div class="node"></div>
                                <div class="node"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 'Tower of Hanoi':
            return `
                <div class="thumbnail-container">
                    <div class="hanoi-thumbnail">
                        ${Array.from({length: 3}, (_, i) => `
                            <div class="tower">
                                <div class="disc" style="width: ${40 - i * 10}px"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        case 'Knapsack':
            return `
                <div class="thumbnail-container">
                    <div class="knapsack-thumbnail">
                        <div class="bag">
                            ${Array.from({length: 3}, () => `
                                <div class="item" style="--size: ${Math.random() * 0.4 + 0.6}">
                                    <span class="weight">${Math.floor(Math.random() * 5 + 1)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="capacity">10</div>
                    </div>
                </div>
            `;

        case 'DFS':
            return `
                <div class="thumbnail-container">
                    <div class="dfs-thumbnail">
                        ${Array.from({length: 16}, (_, i) => `
                            <div class="dfs-thumbnail-cell ${i % 3 === 0 ? 'visited' : ''}"></div>
                        `).join('')}
                    </div>
                </div>
            `;

        default:
            return `
                <div class="thumbnail-container">
                    <div class="default-thumbnail">
                        <div class="thumbnail-bars">
                            ${Array.from({length: 5}, () => `
                                <div class="thumbnail-bar" style="height: ${Math.random() * 40 + 10}px"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
    }
}

function createTreeThumbnail() {
    return `
        <div class="thumbnail-tree">
            <div class="thumbnail-node" style="top: 10px; left: 65px;"></div>
            <div class="thumbnail-node" style="top: 40px; left: 35px;"></div>
            <div class="thumbnail-node" style="top: 40px; left: 95px;"></div>
            <div class="thumbnail-node" style="top: 70px; left: 15px;"></div>
            <div class="thumbnail-node" style="top: 70px; left: 55px;"></div>
            <div class="thumbnail-node" style="top: 70px; left: 75px;"></div>
            <div class="thumbnail-node" style="top: 70px; left: 115px;"></div>
        </div>
    `;
}

function createAlgorithmExplanation(algorithm) {
    const explanations = {
        'Bubble Sort': {
            title: 'Bubble Sort Algorithm',
            description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
            steps: [
                'Compare adjacent elements',
                'Swap them if they are in wrong order',
                'Repeat until no swaps are needed',
                'The largest element "bubbles up" to the end in each iteration'
            ],
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            pseudocode: `
    function bubbleSort(arr):
        n = length(arr)
        for i from 0 to n-1:
            for j from 0 to n-i-1:
                if arr[j] > arr[j+1]:
                    swap(arr[j], arr[j+1])`,
            workingSteps: [
                {
                    title: 'Initial Array',
                    description: 'Start with an unsorted array of numbers.'
                },
                {
                    title: 'Compare Adjacent Elements',
                    description: 'Compare each pair of adjacent elements from left to right.'
                },
                {
                    title: 'Swap if Needed',
                    description: 'If the elements are in wrong order, swap them.'
                },
                {
                    title: 'Complete First Pass',
                    description: 'After first pass, the largest element "bubbles up" to the end.'
                },
                {
                    title: 'Repeat Process',
                    description: 'Repeat the process for remaining elements, each time placing the next largest element into position.'
                }
            ]
        },
        'Insertion Sort': {
            title: 'Insertion Sort Algorithm',
            description: 'Insertion Sort builds the final sorted array one item at a time. It takes each element from the unsorted part and inserts it into its correct position in the sorted part.',
            steps: [
                'Start with first element as sorted array',
                'Take next element and insert it into sorted array',
                'Repeat until all elements are sorted',
                'Each iteration expands sorted array by one'
            ],
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            pseudocode: `
    function insertionSort(arr):
        for i from 1 to length(arr)-1:
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j+1] = arr[j]
                j = j - 1
            arr[j+1] = key`,
        },
        'Merge Sort': {
            title: 'Merge Sort Algorithm',
            description: 'Merge Sort is a divide-and-conquer algorithm that recursively breaks down a problem into smaller, more manageable subproblems until they become simple enough to solve directly.',
            steps: [
                'Divide array into two halves',
                'Recursively sort both halves',
                'Merge the sorted halves',
                'Continue until entire array is sorted'
            ],
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(n)',
            pseudocode: `
    function mergeSort(arr):
        if length(arr) <= 1:
            return arr
        
        mid = length(arr) / 2
        left = mergeSort(arr[0...mid])
        right = mergeSort(arr[mid...end])
        
        return merge(left, right)`,
        },
        'Quick Sort': {
            title: 'Quick Sort Algorithm',
            description: 'Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it.',
            steps: [
                'Choose a pivot element from the array',
                'Partition elements: less than pivot to left, greater to right',
                'Recursively apply the same steps to sub-arrays',
                'Combine the sorted sub-arrays'
            ],
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(log n)',
            pseudocode: `
    function quickSort(arr, low, high):
        if low < high:
            pivot = partition(arr, low, high)
            quickSort(arr, low, pivot - 1)
            quickSort(arr, pivot + 1, high)
            
    function partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j from low to high - 1:
            if arr[j] <= pivot:
                i++
                swap(arr[i], arr[j])
        swap(arr[i + 1], arr[high])
        return i + 1`,
        },
        'Heap Sort': {
            title: 'Heap Sort Algorithm',
            description: 'Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap and then repeatedly extracts the maximum element to create a sorted array.',
            steps: [
                'Build a max heap from the array',
                'Swap root with last element',
                'Reduce heap size by 1',
                'Heapify the root',
                'Repeat until sorted'
            ],
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(1)',
            pseudocode: `
    function heapSort(arr):
        buildMaxHeap(arr)
        for i from length(arr)-1 to 0:
            swap(arr[0], arr[i])
            heapify(arr, 0, i)`,
        }
    };

    const explanation = explanations[algorithm];
    if (!explanation) return '';

    return `
        <div class="flex-1 algorithm-explanation">
            <h3>${explanation.title}</h3>
            <p>${explanation.description}</p>
            <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
            <ul>
                ${explanation.steps.map(step => `<li>${step}</li>`).join('')}
            </ul>
            <div class="mt-4">
                <p><span class="text-cyan-400">Time Complexity:</span> ${explanation.timeComplexity}</p>
                <p><span class="text-cyan-400">Space Complexity:</span> ${explanation.spaceComplexity}</p>
            </div>
            ${explanation.pseudocode ? `
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">${explanation.pseudocode}</pre>
                </div>` : ''}
        </div>
    `;
}

function heapSort() {
    const container = document.getElementById('algorithm-container');
    container.classList.add('heap-sort');  // Add this line
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 heap-container">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Heap Sort</h2>
                <div class="input-container mb-8">
                    <input type="text" 
                           value="64, 34, 25, 12, 22, 11, 90" 
                           placeholder="Enter numbers separated by commas"
                           class="border border-gray-300 rounded px-2 py-1 w-64">
                </div>
                <div id="heap-container" class="relative h-80 mb-12"></div>
                <div id="array-container" class="flex justify-center items-end h-64 mb-8"></div>
                <div class="controls-container flex gap-2"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <div class="flex-1 algorithm-explanation">
                <h3>Heap Sort Algorithm</h3>
                <p>Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It can be thought of as an improved selection sort: like selection sort, it divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region. The improvement over selection sort is that selection sort only partially sorts the data, whereas heap sort partially sorts the data and then accesses the unsorted data once, whereas selection sort accesses unsorted data O(n) times. The heapsort algorithm can be divided into two parts. In the first part, the array is transformed into a heap. By heapifying the array (building a heap), we can efficiently determine the largest element of the array. The second part involves iteratively extracting the largest element from the heap, and inserting it into the sorted array. The heap is updated after each extraction so that the largest element is at the root of the heap.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Build a max heap from the array</li>
                    <li>Swap the root with the last element of the heap</li>
                    <li>Reduce the size of the heap by 1</li>
                    <li>Heapify the root of the heap</li>
                    <li>Repeat until the heap is empty</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(n log n)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(1)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
    function heapSort(arr):
        buildMaxHeap(arr)
        for i from length(arr)-1 to 0:
            swap(arr[0], arr[i])
            heapify(arr, 0, i)</pre>
                </div>
            </div>
        </div>
    `;

    // Get references to containers
    const input = container.querySelector('.input-container input');
    const heapContainer = document.getElementById('heap-container');  // Added this line
    const arrayContainer = document.getElementById('array-container');
    const controlsContainer = container.querySelector('.controls-container');

    let array = [];

    function generateArray() {
        const inputValue = input.value.trim();
        array = inputValue ? 
            inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num)) :
            Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
        
        input.value = array.join(', ');
        renderArray();
        renderHeap();  // Make sure to call renderHeap
    }

    function renderArray() {
        arrayContainer.innerHTML = '';
        array.forEach(value => {
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container flex flex-col items-center';
            
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 2}px`;
            
            const valueLabel = document.createElement('span');
            valueLabel.className = 'value-label mt-2 text-sm';
            valueLabel.textContent = value;
            
            barContainer.appendChild(bar);
            barContainer.appendChild(valueLabel);
            arrayContainer.appendChild(barContainer);
        });
    }

    function renderHeap() {
        heapContainer.innerHTML = '';
        const heapSvg = d3.select(heapContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('g')
            .attr('transform', 'translate(50,20)');

        const treeData = d3.hierarchy(buildHeapTree(array));
        const treeLayout = d3.tree().size([heapContainer.offsetWidth - 100, heapContainer.offsetHeight - 40]);
        const nodes = treeLayout(treeData);

        // Draw links
        heapSvg.selectAll('.link')
            .data(nodes.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y));

        // Draw nodes
        const node = heapSvg.selectAll('.node')
            .data(nodes.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', 20);

        node.append('text')
            .text(d => d.data.value)
            .attr('dy', '0.3em')
            .attr('text-anchor', 'middle');
    }

    function buildHeapTree(arr) {
        if (arr.length === 0) return null;
        return {
            value: arr[0],
            children: [
                arr[1] ? { value: arr[1], children: buildHeapChildren(arr, 1) } : null,
                arr[2] ? { value: arr[2], children: buildHeapChildren(arr, 2) } : null
            ].filter(Boolean)
        };
    }

    function buildHeapChildren(arr, i) {
        const children = [];
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (arr[left]) children.push({ value: arr[left], children: buildHeapChildren(arr, left) });
        if (arr[right]) children.push({ value: arr[right], children: buildHeapChildren(arr, right) });
        
        return children;
    }

    async function heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && array[left] > array[largest]) {
            largest = left;
        }

        if (right < n && array[right] > array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            [array[i], array[largest]] = [array[largest], array[i]];
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            renderArray();
            renderHeap();
            await heapify(n, largest);
        }
    }

    async function startHeapSort() {
        if (sorting) return;
        sorting = true;

        // Build max heap
        for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
            await heapify(array.length, i);
        }

        // Extract elements from heap
        for (let i = array.length - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            renderArray();
            renderHeap();
            await heapify(i, 0);
        }

        sorting = false;
    }

    container.appendChild(createControlButtons(
        startHeapSort,
        () => {
            array = [];
            generateArray();
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            input.value = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1).join(', ');
            generateArray();
        }
    ));

    generateArray();
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        updateThemeIcon();
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });
    
    function updateThemeIcon() {
        const isLight = body.classList.contains('light-theme');
        themeToggle.innerHTML = isLight ? 
            '<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>' :
            '<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>';
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('light-theme', savedTheme === 'light');
        updateThemeIcon();
    }
}

function kmpSearch() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1 max-w-[2705px] relative">
                <h2 class="text-2xl font-bold mb-4">KMP String Search</h2>
                <div class="input-container mb-4">
                    <div class="mb-4">
                        <label class="block mb-2">Text:</label>
                        <input type="text" id="text-input" value="ABABDABACDABABCABAB" class="w-full">
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Pattern:</label>
                        <input type="text" id="pattern-input" value="ABABCABAB" class="w-full">
                    </div>
                </div>
                <div id="visualization" class="mb-8"></div>
                <div class="controls-container flex justify-center gap-3"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <!-- Right side: Algorithm Explanation -->
            <div class="flex-1 algorithm-explanation">
                <h3>KMP (Knuth-Morris-Pratt) Search Algorithm</h3>
                <p>KMP is an efficient string searching algorithm that finds occurrences of a pattern string within a main text string.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Compute the LPS (Longest Proper Prefix which is also Suffix) array</li>
                    <li>Use LPS to skip characters when mismatch occurs</li>
                    <li>Match pattern characters with text</li>
                    <li>When mismatch occurs, use LPS to know how many characters to skip</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(n + m)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(m)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
    function KMPSearch(text, pattern):
        n = length(text)
        m = length(pattern)
        lps = computeLPSArray(pattern)
        
        i = 0  // index for text
        j = 0  // index for pattern
        while i < n:
            if pattern[j] == text[i]:
                i++
                j++
            if j == m:
                print "Found pattern"
                j = lps[j-1]
            else if i < n and pattern[j] != text[i]:
                if j != 0:
                    j = lps[j-1]
                else:
                    i++</pre>
                </div>
            </div>
        </div>
    `;

    const textInput = document.getElementById('text-input');
    const patternInput = document.getElementById('pattern-input');
    const visualization = document.getElementById('visualization');
    const controlsContainer = container.querySelector('.controls-container');

    // Add control buttons with full-screen support (only once)
    controlsContainer.appendChild(createControlButtons(
        visualizeKMP,
        resetKMP,
        generateRandomText,
        false  // Enable full-screen for KMP
    ));

    function computeLPSArray(pattern) {
        const lps = [0];
        let len = 0;
        let i = 1;

        while (i < pattern.length) {
            if (pattern[i] === pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    async function visualizeKMP() {
        const text = textInput.value;
        const pattern = patternInput.value;
        const lps = computeLPSArray(pattern);
        currentStep = 0;
        
        visualization.innerHTML = '';
        const textDiv = document.createElement('div');
        textDiv.className = 'flex flex-wrap gap-2 mb-4';
        
        text.split('').forEach((char, i) => {
            const charDiv = document.createElement('div');
            charDiv.className = 'w-8 h-8 flex items-center justify-center border rounded';
            charDiv.textContent = char;
            textDiv.appendChild(charDiv);
        });
        
        visualization.appendChild(textDiv);
        
        let i = 0;
        let j = 0;
        const matches = [];
        
        while (i < text.length) {
            const chars = textDiv.children;
            
            Array.from(chars).forEach(c => c.style.background = '');
            
            chars[i].style.background = 'rgba(0, 255, 245, 0.3)';
            if (j > 0) {
                for (let k = i - j; k < i; k++) {
                    chars[k].style.background = 'rgba(0, 255, 245, 0.1)';
                }
            }
            
            if (text[i] === pattern[j]) {
                i++;
                j++;
                currentStep++;
                updateStepCounter();
            } else {
                if (j !== 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
                currentStep++;
                updateStepCounter();
            }
            
            if (j === pattern.length) {
                matches.push(i - j);
                j = lps[j - 1];
            }
            
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
        
        matches.forEach(start => {
            for (let k = start; k < start + pattern.length; k++) {
                textDiv.children[k].style.background = 'rgba(0, 255, 245, 0.5)';
            }
        });
    }

    function resetKMP() {
        textInput.value = 'ABABDABACDABABCABAB';
        patternInput.value = 'ABABCABAB';
        visualization.innerHTML = '';
        currentStep = 0;
        updateStepCounter();
    }

    function generateRandomText() {
        const randomText = Array.from({length: 20}, () => 
            String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
        const patternLength = 5 + Math.floor(Math.random() * 5);
        const start = Math.floor(Math.random() * (randomText.length - patternLength));
        const pattern = randomText.slice(start, start + patternLength);
        
        textInput.value = randomText;
        patternInput.value = pattern;
        visualization.innerHTML = '';
        currentStep = 0;
        updateStepCounter();
    }
}

function updateStepDescription(description) {
    const stepDescription = document.getElementById('step-description');
    if (stepDescription) {
        stepDescription.innerHTML = `
            <div class="step-visualization">
                ${description}
            </div>
        `;
    }
}

function selectionSort() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1 max-w-[2705px]">
                <h2 class="text-2xl font-bold mb-4">Selection Sort</h2>
                <div class="input-container mb-4">
                    <input type="text" value="64, 34, 25, 12, 22, 11, 90" 
                           placeholder="Enter numbers separated by commas"
                           class="w-full max-w-[1732px]">
                </div>
                <div id="array-container" class="flex items-end justify-center h-64 mb-8"></div>
                <div class="controls-container flex gap-2"></div>
                <div id="step-counter" class="text-center mt-4">
                    <span class="text-cyan-400">Current Step:</span> <span>0</span>
                </div>
            </div>
            <!-- Right side: Algorithm Explanation -->
            <div class="flex-1 algorithm-explanation">
                <h3>Selection Sort Algorithm</h3>
                <p>Selection Sort is a simple sorting algorithm that repeatedly finds the minimum element from the unsorted portion and places it at the beginning.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Find the minimum element in unsorted array</li>
                    <li>Swap it with the first element of unsorted part</li>
                    <li>Move the boundary of unsorted array by 1</li>
                    <li>Repeat until array is sorted</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(n²)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(1)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
    function selectionSort(arr):
        for i from 0 to length(arr)-1:
            minIdx = i
            for j from i+1 to length(arr):
                if arr[j] < arr[minIdx]:
                    minIdx = j
            swap(arr[i], arr[minIdx])</pre>
                </div>
            </div>
        </div>
    `;

    // Get references to the containers
    const input = container.querySelector('.input-container input');
    const arrayContainer = document.getElementById('array-container');
    const controlsContainer = container.querySelector('.controls-container');

    function generateArray() {
        const inputValue = input.value.trim();
        let array;
        if (inputValue) {
            array = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        } else {
            array = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
        }
        
        input.value = array.join(', ');
        
        arrayContainer.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 2}px`;
            bar.textContent = value;
            arrayContainer.appendChild(bar);
        });
    }

    generateArray();
    input.addEventListener('change', generateArray);

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startSelectionSort,
        () => selectAlgorithm({name: 'Selection Sort', function: selectionSort}),
        () => {
            input.value = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1).join(', ');
            generateArray();
        }
    ));

    async function startSelectionSort() {
        if (sorting) return;
        sorting = true;
        const bars = arrayContainer.children;
        
        for (let i = 0; i < bars.length - 1; i++) {
            let minIdx = i;
            bars[i].classList.add('current');
            
            for (let j = i + 1; j < bars.length; j++) {
                bars[j].classList.add('comparing');
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                
                if (parseInt(bars[j].textContent) < parseInt(bars[minIdx].textContent)) {
                    bars[minIdx].classList.remove('minimum');
                    minIdx = j;
                    bars[minIdx].classList.add('minimum');
                }
                
                bars[j].classList.remove('comparing');
            }
            
            if (minIdx !== i) {
                const bar1 = bars[i];
                const bar2 = bars[minIdx];
                
                const rect1 = bar1.getBoundingClientRect();
                const rect2 = bar2.getBoundingClientRect();
                const distance = rect2.left - rect1.left;
                
                await Promise.all([
                    new Promise(resolve => {
                        gsap.to(bar1, {
                            x: distance,
                            duration: animationSpeed / 1000,
                            ease: "power2.inOut",
                            onComplete: resolve
                        });
                    }),
                    new Promise(resolve => {
                        gsap.to(bar2, {
                            x: -distance,
                            duration: animationSpeed / 1000,
                            ease: "power2.inOut",
                            onComplete: resolve
                        });
                    })
                ]);
                
                gsap.set([bar1, bar2], { x: 0 });
                arrayContainer.insertBefore(bar2, bar1);
                arrayContainer.insertBefore(bar1, bars[minIdx]);
            }
            
            bars[i].classList.remove('current');
            if (minIdx !== i) bars[minIdx].classList.remove('minimum');
            currentStep++;
            updateStepCounter();
        }
        
        sorting = false;
    }
}

// Add this to the visualization container in all sorting algorithms
function createSpeedDial() {
    const speedDialContainer = document.createElement('div');
    speedDialContainer.className = 'speed-dial-container';
    
    const speedLabel = document.createElement('span');
    speedLabel.className = 'speed-label';
    speedLabel.textContent = 'Speed';
    
    const speedInput = document.createElement('input');
    speedInput.type = 'range';
    speedInput.className = 'speed-dial';
    speedInput.min = '50';
    speedInput.max = '1000';
    speedInput.value = animationSpeed;
    speedInput.addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
    });
    
    speedDialContainer.appendChild(speedLabel);
    speedDialContainer.appendChild(speedInput);
    
    return speedDialContainer;
}

function binarySearch() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Binary Search</h2>
                <div class="flex gap-4 mb-4">
                    <div class="input-container">
                        <label class="input-label">Input Array</label>
                        <input type="text" 
                               value="2, 5, 8, 12, 16, 23, 38" 
                               placeholder="Enter sorted numbers (max 7)"
                               class="border border-gray-300 rounded px-2 py-1 w-64">
                    </div>
                    <div class="search-input-container">
                        <label class="input-label">Search Value</label>
                        <input type="number" 
                               value="23" 
                               placeholder="Search number"
                               class="border border-gray-300 rounded px-2 py-1 w-32">
                    </div>
                </div>
                <div class="linked-list-container"></div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <!-- Step counter will be added as fixed element in fullscreen -->
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation (below controls) -->
            <div class="algorithm-explanation">
                <h3>Binary Search Algorithm</h3>
                <p>Binary Search is an efficient algorithm for finding a target value within a sorted array. It works by repeatedly dividing the search interval in half.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Compare target with middle element</li>
                    <li>If target matches middle element, return index</li>
                    <li>If target is less than middle, search left half</li>
                    <li>If target is greater than middle, search right half</li>
                    <li>Repeat until target is found or interval is empty</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(log n)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(1)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
function binarySearch(arr, target):
    left = 0
    right = length(arr) - 1
    
    while left <= right:
        mid = (left + right) / 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1</pre>
                </div>
            </div>
        </div>
    `;

    // Get references to containers
    const input = container.querySelector('.input-container input');
    const searchInput = container.querySelector('.search-input-container input');
    const listContainer = container.querySelector('.linked-list-container');
    const controlsContainer = container.querySelector('.controls-container');
    let array = [];
    let searching = false;

    function validateAndLimitInput(inputStr) {
        const numbers = inputStr.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        return numbers.slice(0, 7).sort((a, b) => a - b);
    }

    function generateArray() {
        const inputValue = input.value.trim();
        array = inputValue ? 
            validateAndLimitInput(inputValue) :
            Array.from({length: 7}, (_, i) => i * 10 + Math.floor(Math.random() * 5));
        
        input.value = array.join(', ');
        renderLinkedList();
    }

    function getStepDescription(left, right, mid, target, found = false) {
        if (found) return `Found target value ${target} at position ${mid}!`;
        if (mid === -1) return 'Starting binary search...';
        
        const midValue = array[mid];
        if (midValue === target) {
            return `Comparing middle element ${midValue} with target ${target}. They match!`;
        } else if (midValue < target) {
            return `${midValue} < ${target}, searching right half (positions ${mid + 1} to ${right})`;
        } else {
            return `${midValue} > ${target}, searching left half (positions ${left} to ${mid - 1})`;
        }
    }

    function updateStepDetails(description) {
        const stepDetails = container.querySelector('.step-details');
        stepDetails.textContent = description;
        
        // Animate the update
        stepDetails.style.opacity = '0';
        setTimeout(() => {
            stepDetails.style.opacity = '1';
        }, 50);
    }

    function renderLinkedList(left = -1, right = -1, mid = -1, found = -1) {
        listContainer.innerHTML = '';
        const target = parseInt(searchInput.value);
        
        array.forEach((value, index) => {
            const node = document.createElement('div');
            node.className = 'list-node';
            
            const content = document.createElement('div');
            content.className = 'node-content';
            content.textContent = value;
            
            const description = document.createElement('div');
            description.className = 'step-description';
            
            // Add different states and descriptions
            if (index === found) {
                node.classList.add('found', 'active');
                description.textContent = `Found ${value}!`;
            } else if (index === mid) {
                node.classList.add('comparing', 'active');
                description.textContent = `Comparing ${value} with ${target}`;
            } else if (index >= left && index <= right) {
                node.classList.add('in-range');
            }
            
            node.appendChild(description);
            node.appendChild(content);
            
            if (index < array.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'node-arrow';
                node.appendChild(arrow);
            }
            
            listContainer.appendChild(node);
        });
    }

    async function startBinarySearch() {
        if (searching) return;
        searching = true;
        currentStep = 0;
        
        const target = parseInt(searchInput.value);
        let left = 0;
        let right = array.length - 1;
        
        updateStepDetails('Starting binary search...');
        renderLinkedList(-1, -1, -1);
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const description = getStepDescription(left, right, mid, target);
            
            updateStepDetails(description);
            renderLinkedList(left, right, mid);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            
            if (array[mid] === target) {
                updateStepDetails(getStepDescription(left, right, mid, target, true));
                renderLinkedList(-1, -1, -1, mid);
                searching = false;
                return;
            }
            
            if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
            
            currentStep++;
            updateStepCounter();
        }
        
        updateStepDetails(`Target value ${target} not found in the array.`);
        renderLinkedList();
        searching = false;
    }

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startBinarySearch,
        () => {
            array = [];
            generateArray();
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            input.value = Array.from({length: 7}, (_, i) => i * 10 + Math.floor(Math.random() * 5))
                .sort((a, b) => a - b).join(', ');
            generateArray();
        }
    ));

    // Add input validation
    input.addEventListener('change', () => {
        const validatedArray = validateAndLimitInput(input.value);
        input.value = validatedArray.join(', ');
        generateArray();
    });

    generateArray();
}

function towerOfHanoi() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Tower of Hanoi</h2>
                <div class="flex gap-4 mb-4">
                    <div class="input-container">
                        <label class="input-label">Number of Discs</label>
                        <input type="number" 
                               value="3" 
                               min="1" 
                               max="7"
                               class="w-32">
                    </div>
                </div>
                <div class="towers-container"></div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation -->
            <div class="algorithm-explanation">
                <h3>Tower of Hanoi</h3>
                <p>Tower of Hanoi is a mathematical game or puzzle consisting of three rods and a number of disks of various diameters, which can slide onto any rod.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Rules:</h4>
                <ul>
                    <li>Only one disk may be moved at a time</li>
                    <li>Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty rod</li>
                    <li>No larger disk may be placed on top of a smaller disk</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(2^n)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(n)</p>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('input');
    const towersContainer = container.querySelector('.towers-container');
    const controlsContainer = container.querySelector('.controls-container');
    let towers = [[], [], []];
    let moving = false;

    function createTowers() {
        towersContainer.innerHTML = '';
        towers = [[], [], []];
        const n = parseInt(input.value);
        
        // Create towers
        for (let i = 0; i < 3; i++) {
            const tower = document.createElement('div');
            tower.className = 'tower';
            
            const label = document.createElement('div');
            label.className = 'tower-label';
            label.textContent = ['Source', 'Auxiliary', 'Target'][i];
            tower.appendChild(label);
            
            towersContainer.appendChild(tower);
        }
        
        // Add discs to first tower
        const firstTower = towersContainer.children[0];
        for (let i = n; i > 0; i--) {
            const disc = document.createElement('div');
            disc.className = 'disc';
            disc.style.width = `${100 + (i * 20)}px`;
            disc.textContent = i;
            firstTower.appendChild(disc);
            towers[0].push(i);
        }
    }

    async function moveDisc(from, to) {
        const fromTower = towersContainer.children[from];
        const toTower = towersContainer.children[to];
        const disc = fromTower.querySelector('.disc:last-child');
        
        if (!disc) return;
        
        disc.classList.add('moving');
        
        // Animate the move
        const fromRect = fromTower.getBoundingClientRect();
        const toRect = toTower.getBoundingClientRect();
        const discRect = disc.getBoundingClientRect();
        
        const xDistance = toRect.left - fromRect.left;
        const yDistance = toRect.top - fromRect.top;
        
        // Move up
        await new Promise(resolve => {
            gsap.to(disc, {
                y: -200,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: resolve
            });
        });
        
        // Move horizontally
        await new Promise(resolve => {
            gsap.to(disc, {
                x: xDistance,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: resolve
            });
        });
        
        // Move down
        await new Promise(resolve => {
            gsap.to(disc, {
                y: yDistance,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: resolve
            });
        });
        
        // Update DOM and reset transforms
        toTower.appendChild(disc);
        gsap.set(disc, { x: 0, y: 0 });
        disc.classList.remove('moving');
        
        // Update towers array
        const value = towers[from].pop();
        towers[to].push(value);
        
        currentStep++;
        updateStepCounter();
    }

    async function solveTowerOfHanoi(n, source, auxiliary, target) {
        if (n === 1) {
            await moveDisc(source, target);
            return;
        }
        
        await solveTowerOfHanoi(n - 1, source, target, auxiliary);
        await moveDisc(source, target);
        await solveTowerOfHanoi(n - 1, auxiliary, source, target);
    }

    async function startTowerOfHanoi() {
        if (moving) return;
        moving = true;
        currentStep = 0;
        
        const n = parseInt(input.value);
        await solveTowerOfHanoi(n, 0, 1, 2);
        
        moving = false;
    }

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        startTowerOfHanoi,
        () => {
            createTowers();
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            // Generate random number of discs between 3 and 7
            input.value = Math.floor(Math.random() * 5) + 3;
            createTowers();
            currentStep = 0;
            updateStepCounter();
        }
    ));

    // Initialize
    createTowers();
}

function knapsack() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">0/1 Knapsack</h2>
                <div class="flex gap-4 mb-4">
                    <div class="input-container">
                        <label class="input-label">Capacity</label>
                        <input type="number" 
                               value="10" 
                               min="1" 
                               max="20"
                               class="w-32">
                    </div>
                </div>
                <div class="items-container"></div>
                <div class="knapsack-grid"></div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation -->
            <div class="algorithm-explanation">
                <h3>0/1 Knapsack Problem</h3>
                <p>The 0/1 Knapsack problem is a problem in combinatorial optimization where we need to select items with given weights and values to maximize the value while keeping the total weight under a given capacity.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Rules:</h4>
                <ul>
                    <li>Each item can be selected only once (0/1)</li>
                    <li>Items cannot be broken into smaller pieces</li>
                    <li>Total weight must not exceed capacity</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(nW)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(nW)</p>
                </div>
                <div class="mt-4">
                    <h4 class="font-bold text-cyan-400 mb-2">Pseudocode:</h4>
                    <pre class="pseudocode">
for i from 0 to n:
    for w from 0 to W:
        if weight[i] <= w:
            dp[i][w] = max(
                value[i] + dp[i-1][w-weight[i]],
                dp[i-1][w]
            )
        else:
            dp[i][w] = dp[i-1][w]</pre>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('input');
    const itemsContainer = container.querySelector('.items-container');
    const gridContainer = container.querySelector('.knapsack-grid');
    const controlsContainer = container.querySelector('.controls-container');
    
    let items = [
        { weight: 2, value: 3 },
        { weight: 3, value: 4 },
        { weight: 4, value: 5 },
        { weight: 5, value: 6 }
    ];
    let dp = [];
    let solving = false;

    function createItems() {
        itemsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div>Item ${index + 1}</div>
                <div>Weight: ${item.weight}</div>
                <div>Value: ${item.value}</div>
            `;
            itemsContainer.appendChild(card);
        });
    }

    function createGrid() {
        const capacity = parseInt(input.value);
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${capacity + 1}, 1fr)`;
        
        // Create header row
        for (let w = 0; w <= capacity; w++) {
            const cell = document.createElement('div');
            cell.className = 'knapsack-cell';
            cell.textContent = w;
            gridContainer.appendChild(cell);
        }
        
        // Create grid
        for (let i = 0; i <= items.length; i++) {
            for (let w = 0; w <= capacity; w++) {
                const cell = document.createElement('div');
                cell.className = 'knapsack-cell';
                cell.dataset.row = i;
                cell.dataset.col = w;
                cell.textContent = '0';
                gridContainer.appendChild(cell);
            }
        }
    }

    async function solveKnapsack() {
        if (solving) return;
        solving = true;
        currentStep = 0;
        
        const capacity = parseInt(input.value);
        dp = Array(items.length + 1).fill().map(() => Array(capacity + 1).fill(0));
        
        for (let i = 1; i <= items.length; i++) {
            const item = items[i - 1];
            for (let w = 0; w <= capacity; w++) {
                const cell = gridContainer.querySelector(`[data-row="${i}"][data-col="${w}"]`);
                cell.classList.add('active');
                
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                
                if (item.weight <= w) {
                    dp[i][w] = Math.max(
                        item.value + dp[i-1][w-item.weight],
                        dp[i-1][w]
                    );
                } else {
                    dp[i][w] = dp[i-1][w];
                }
                
                cell.textContent = dp[i][w];
                cell.classList.remove('active');
                
                if (i === items.length && w === capacity) {
                    cell.classList.add('optimal');
                }
                
                currentStep++;
                updateStepCounter();
            }
        }
        
        // Highlight selected items
        let w = capacity;
        for (let i = items.length; i > 0; i--) {
            if (dp[i][w] !== dp[i-1][w]) {
                const item = items[i-1];
                itemsContainer.children[i-1].classList.add('selected');
                w -= item.weight;
            }
        }
        
        solving = false;
    }

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        solveKnapsack,
        () => {
            createItems();
            createGrid();
            currentStep = 0;
            updateStepCounter();
            itemsContainer.querySelectorAll('.item-card').forEach(card => {
                card.classList.remove('selected');
            });
        },
        () => {
            // Generate random capacity between 10 and 20
            input.value = Math.floor(Math.random() * 11) + 10;
            
            // Generate random items
            items = Array.from({length: 4}, (_, i) => ({
                weight: Math.floor(Math.random() * 5) + 2,  // weight between 2-6
                value: Math.floor(Math.random() * 5) + 3    // value between 3-7
            }));
            
            createItems();
            createGrid();
            currentStep = 0;
            updateStepCounter();
        }
    ));

    // Initialize
    createItems();
    createGrid();
}

function stackVisualizer() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Stack Operations</h2>
                <div class="flex gap-4 mb-4">
                    <div class="input-container">
                        <label class="input-label">Value</label>
                        <input type="number" 
                               value="42" 
                               placeholder="Enter value to push"
                               class="w-32">
                    </div>
                </div>
                <div class="stack-operations">
                    <button class="push-btn">Push</button>
                    <button class="pop-btn">Pop</button>
                    <button class="peek-btn">Peek</button>
                </div>
                <div class="stack-container">
                    <div class="stack-elements"></div>
                    <div class="stack-base"></div>
                </div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation -->
            <div class="algorithm-explanation">
                <h3>Stack Data Structure</h3>
                <p>A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Elements are added and removed from the same end, called the top of the stack.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Operations:</h4>
                <ul>
                    <li>Push: Add an element to the top</li>
                    <li>Pop: Remove and return the top element</li>
                    <li>Peek: View the top element without removing it</li>
                    <li>isEmpty: Check if stack is empty</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(1) for all operations</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(n)</p>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('input');
    const stackContainer = container.querySelector('.stack-elements');
    const pushBtn = container.querySelector('.push-btn');
    const popBtn = container.querySelector('.pop-btn');
    const peekBtn = container.querySelector('.peek-btn');
    
    let stack = [];
    let animating = false;

    async function push() {
        if (animating || stack.length >= 8) return;
        animating = true;
        
        const value = parseInt(input.value);
        if (isNaN(value)) return;
        
        const element = document.createElement('div');
        element.className = 'stack-element pushing';
        element.innerHTML = `
            ${value}
            <span class="operation-label">Pushed</span>
        `;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.8)';
        
        stackContainer.insertBefore(element, stackContainer.firstChild);
        stack.push(value);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        element.classList.remove('pushing');
        
        currentStep++;
        updateStepCounter();
        animating = false;
    }

    async function pop() {
        if (animating || stack.length === 0) return;
        animating = true;
        
        const element = stackContainer.firstChild;
        element.classList.add('popping');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.8)';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        stackContainer.removeChild(element);
        stack.pop();
        
        currentStep++;
        updateStepCounter();
        animating = false;
    }

    async function peek() {
        if (animating || stack.length === 0) return;
        
        const element = stackContainer.firstChild;
        element.classList.add('pushing');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        element.classList.remove('pushing');
    }

    // Add event listeners
    pushBtn.addEventListener('click', push);
    popBtn.addEventListener('click', pop);
    peekBtn.addEventListener('click', peek);

    // Add control buttons
    const controlsContainer = container.querySelector('.controls-container');
    controlsContainer.appendChild(createControlButtons(
        null,
        () => {
            stack = [];
            stackContainer.innerHTML = '';
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            stack = [];
            stackContainer.innerHTML = '';
            
            // Add random elements
            const count = Math.floor(Math.random() * 5) + 3;
            for (let i = 0; i < count; i++) {
                const value = Math.floor(Math.random() * 90) + 10;
                const element = document.createElement('div');
                element.className = 'stack-element';
                element.innerHTML = `
                    ${value}
                    <span class="operation-label">Pushed</span>
                `;
                stackContainer.insertBefore(element, stackContainer.firstChild);
                stack.push(value);
            }
            
            currentStep = 0;
            updateStepCounter();
        }
    ));

    container.querySelector('.algorithm-explanation').innerHTML += `
        <div class="pseudo-code mt-4">
            <h4 class="font-bold text-cyan-400 mb-2">Pseudo Code:</h4>
            <pre class="code-block">
Stack Operations:
push(value):
    if stack is not full:
        increment top
        stack[top] = value
    else:
        overflow error

pop():
    if stack is not empty:
        value = stack[top]
        decrement top
        return value
    else:
        underflow error

peek():
    if stack is not empty:
        return stack[top]
    else:
        stack empty error</pre>
        </div>
    `;
}

function queueVisualizer() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Queue Operations</h2>
                <div class="flex gap-4 mb-4">
                    <div class="input-container">
                        <label class="input-label">Value</label>
                        <input type="number" 
                               value="42" 
                               placeholder="Enter value to enqueue"
                               class="w-32">
                    </div>
                </div>
                <div class="queue-operations">
                    <button class="enqueue-btn">Enqueue</button>
                    <button class="dequeue-btn">Dequeue</button>
                    <button class="peek-btn">Peek</button>
                </div>
                <div class="queue-container">
                    <div class="queue-elements"></div>
                </div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation -->
            <div class="algorithm-explanation">
                <h3>Queue Data Structure</h3>
                <p>A queue is a linear data structure that follows the First In First Out (FIFO) principle. Elements are added at the rear and removed from the front.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Operations:</h4>
                <ul>
                    <li>Enqueue: Add an element to the rear</li>
                    <li>Dequeue: Remove and return the front element</li>
                    <li>Peek: View the front element without removing it</li>
                    <li>isEmpty: Check if queue is empty</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(1) for all operations</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(n)</p>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('input');
    const queueContainer = container.querySelector('.queue-elements');
    const enqueueBtn = container.querySelector('.enqueue-btn');
    const dequeueBtn = container.querySelector('.dequeue-btn');
    const peekBtn = container.querySelector('.peek-btn');
    
    let queue = [];
    let animating = false;

    async function enqueue() {
        if (animating || queue.length >= 8) return;
        animating = true;
        
        const value = parseInt(input.value);
        if (isNaN(value)) return;
        
        const element = document.createElement('div');
        element.className = 'queue-element enqueueing';
        element.innerHTML = `
            ${value}
            <span class="operation-label">Enqueued</span>
        `;
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) scale(0.8)';  // Start from bottom
        
        queueContainer.appendChild(element);
        queue.push(value);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        element.classList.remove('enqueueing');
        
        currentStep++;
        updateStepCounter();
        animating = false;
    }

    async function dequeue() {
        if (animating || queue.length === 0) return;
        animating = true;
        
        const element = queueContainer.firstChild;
        element.classList.add('dequeueing');
        element.querySelector('.operation-label').textContent = 'Dequeued';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        element.style.opacity = '0';
        element.style.transform = 'translateY(-50px) scale(0.8)';  // Move up when removing
        
        await new Promise(resolve => setTimeout(resolve, 500));
        queueContainer.removeChild(element);
        queue.shift();
        
        currentStep++;
        updateStepCounter();
        animating = false;
    }

    async function peek() {
        if (animating || queue.length === 0) return;
        
        const element = queueContainer.firstChild;
        element.classList.add('enqueueing');
        element.querySelector('.operation-label').textContent = 'Front';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        element.classList.remove('enqueueing');
    }

    // Add event listeners
    enqueueBtn.addEventListener('click', enqueue);
    dequeueBtn.addEventListener('click', dequeue);
    peekBtn.addEventListener('click', peek);

    // Add control buttons
    const controlsContainer = container.querySelector('.controls-container');
    controlsContainer.appendChild(createControlButtons(
        null,
        () => {
            queue = [];
            queueContainer.innerHTML = '';
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            queue = [];
            queueContainer.innerHTML = '';
            
            // Add random elements
            const count = Math.floor(Math.random() * 5) + 3;
            for (let i = 0; i < count; i++) {
                const value = Math.floor(Math.random() * 90) + 10;
                const element = document.createElement('div');
                element.className = 'queue-element';
                element.innerHTML = `
                    ${value}
                    <span class="operation-label">Element ${i + 1}</span>
                `;
                queueContainer.appendChild(element);
                queue.push(value);
            }
            
            currentStep = 0;
            updateStepCounter();
        }
    ));

    container.querySelector('.algorithm-explanation').innerHTML += `
        <div class="pseudo-code mt-4">
            <h4 class="font-bold text-cyan-400 mb-2">Pseudo Code:</h4>
            <pre class="code-block">
Queue Operations:
enqueue(value):
    if queue is not full:
        rear = (rear + 1) % size
        queue[rear] = value
    else:
        overflow error

dequeue():
    if queue is not empty:
        value = queue[front]
        front = (front + 1) % size
        return value
    else:
        underflow error

peek():
    if queue is not empty:
        return queue[front]
    else:
        queue empty error</pre>
        </div>
    `;
}

function bubbleSortArray() {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Bubble Sort Array</h2>
                <div class="flex gap-4 mb-4">
                    <div class="input-container">
                        <label class="input-label">Array Size</label>
                        <input type="number" 
                               value="8" 
                               min="4" 
                               max="12"
                               class="w-32">
                    </div>
                </div>
                <div class="bubble-array-container">
                    <div class="bubble-array"></div>
                </div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation -->
            <div class="algorithm-explanation">
                <h3>Bubble Sort Array</h3>
                <p>Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Compare adjacent elements</li>
                    <li>Swap if they are in wrong order</li>
                    <li>Repeat until no swaps needed</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(n²)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(1)</p>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('input');
    const arrayContainer = container.querySelector('.bubble-array');
    const controlsContainer = container.querySelector('.controls-container');
    
    let array = [];
    let sorting = false;

    function createArray(size) {
        array = Array.from({length: size}, () => Math.floor(Math.random() * 90) + 10);
        updateArrayDisplay();
    }

    function updateArrayDisplay() {
        arrayContainer.innerHTML = '';
        const maxHeight = 250;  // Maximum height in pixels
        const maxValue = Math.max(...array);
        
        array.forEach(value => {
            const height = (value / maxValue) * maxHeight;
            const element = document.createElement('div');
            element.className = 'bubble-element';
            element.style.height = `${height}px`;
            element.innerHTML = `<span class="bubble-value">${value}</span>`;
            arrayContainer.appendChild(element);
        });
    }

    async function bubbleSort() {
        if (sorting) return;
        sorting = true;
        const elements = arrayContainer.children;
        
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (sorting) {
                    elements[j].classList.add('comparing');
                    elements[j + 1].classList.add('comparing');
                    
                    await new Promise(resolve => setTimeout(resolve, animationSpeed));
                    
                    if (array[j] > array[j + 1]) {
                        // Swap values in array
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                        
                        // Visual swap
                        elements[j].classList.add('swapping');
                        elements[j + 1].classList.add('swapping');
                        
                        const temp = elements[j].style.height;
                        elements[j].style.height = elements[j + 1].style.height;
                        elements[j + 1].style.height = temp;
                        
                        elements[j].querySelector('.bubble-value').textContent = array[j];
                        elements[j + 1].querySelector('.bubble-value').textContent = array[j + 1];
                        
                        await new Promise(resolve => setTimeout(resolve, animationSpeed));
                        
                        elements[j].classList.remove('swapping');
                        elements[j + 1].classList.remove('swapping');
                    }
                    
                    elements[j].classList.remove('comparing');
                    elements[j + 1].classList.remove('comparing');
                    
                    currentStep++;
                    updateStepCounter();
                }
            }
        }
        
        sorting = false;
    }

    // Add control buttons
    controlsContainer.appendChild(createControlButtons(
        bubbleSort,
        () => {
            sorting = false;
            createArray(parseInt(input.value));
            currentStep = 0;
            updateStepCounter();
        },
        () => {
            sorting = false;
            const size = Math.floor(Math.random() * 5) + 8;  // Random size between 8-12
            input.value = size;
            createArray(size);
            currentStep = 0;
            updateStepCounter();
        }
    ));

    // Initialize
    createArray(parseInt(input.value));
}

function dfsVisualization() {
    const container = document.getElementById('algorithm-container');
    const GRID_SIZE = 10;
    
    container.innerHTML = `
        <div class="flex flex-col gap-8">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-4">Depth-First Search</h2>
                <div class="grid-container">
                    <div class="dfs-grid"></div>
                </div>
                <div class="controls-container flex justify-center gap-2 mb-8"></div>
                <div id="step-counter" class="text-center mb-8 hidden-in-fullscreen">
                    <div>
                        <span class="text-cyan-400">Current Step:</span> <span>0</span>
                    </div>
                    <div class="step-details"></div>
                </div>
            </div>
            
            <!-- Algorithm Explanation -->
            <div class="algorithm-explanation">
                <h3>Depth-First Search (DFS)</h3>
                <p>DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking.</p>
                <h4 class="font-bold text-cyan-400 mt-4 mb-2">Steps:</h4>
                <ul>
                    <li>Start at a given cell (top-left)</li>
                    <li>Explore as far as possible along each branch</li>
                    <li>Backtrack when no unvisited neighbors exist</li>
                    <li>Continue until all reachable cells are visited</li>
                </ul>
                <div class="mt-4">
                    <p><span class="text-cyan-400">Time Complexity:</span> O(V + E)</p>
                    <p><span class="text-cyan-400">Space Complexity:</span> O(V)</p>
                </div>
            </div>
        </div>
    `;

    const gridContainer = container.querySelector('.dfs-grid');
    const cells = [];
    let isRunning = false;

    // Create grid
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'dfs-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            if (Math.random() < 0.2) {
                cell.classList.add('wall');
            }
            gridContainer.appendChild(cell);
            cells.push(cell);
        }
    }

    // Get starting cell (top-left)
    const startCell = cells[0];
    startCell.classList.remove('wall');
    startCell.classList.add('start');

    async function dfs(row, col, visited = new Set()) {
        if (!isRunning) return;
        
        const key = `${row},${col}`;
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || 
            visited.has(key) || cells[row * GRID_SIZE + col].classList.contains('wall')) {
            return;
        }

        // Mark as visited
        visited.add(key);
        const cell = cells[row * GRID_SIZE + col];
        if (!cell.classList.contains('start')) {
            cell.classList.add('visited');
        }
        
        currentStep++;
        updateStepCounter();
        await new Promise(resolve => setTimeout(resolve, animationSpeed));

        // Define directions: up, right, down, left
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        
        // Explore neighbors in DFS manner
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            await dfs(newRow, newCol, visited);
        }

        // Backtrack visualization
        if (!cell.classList.contains('start')) {
            cell.classList.add('backtrack');
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            cell.classList.remove('backtrack');
        }
    }

    // Add control buttons
    const controlsContainer = container.querySelector('.controls-container');
    controlsContainer.appendChild(createControlButtons(
        async () => {
            isRunning = true;
            await dfs(0, 0);
            isRunning = false;
        },
        () => {
            isRunning = false;
            cells.forEach(cell => {
                cell.className = 'dfs-cell';
                if (Math.random() < 0.2) {
                    cell.classList.add('wall');
                }
            });
            startCell.classList.remove('wall');
            startCell.classList.add('start');
            currentStep = 0;
            updateStepCounter();
        }
    ));

    container.querySelector('.algorithm-explanation').innerHTML += `
        <div class="pseudo-code mt-4">
            <h4 class="font-bold text-cyan-400 mb-2">Pseudo Code:</h4>
            <pre class="code-block">
DFS(graph, start):
    visited = empty set
    stack = empty stack
    
    push start to stack
    while stack is not empty:
        vertex = pop from stack
        if vertex not in visited:
            visit vertex
            add vertex to visited
            for each neighbor of vertex:
                if neighbor not in visited:
                    push neighbor to stack</pre>
        </div>
    `;
}

initializeAlgorithmButtons();
selectAlgorithm(algorithms[0]);
initializeSpeedControl();
initializeThemeToggle();