'''
Based on:
k Means Clustering for Ch10 of Machine Learning in Action
by Peter Harrington
'''
from numpy import *
import json
from languages_heatmap_results import distEclud, order

def getDiff(char1, char2):
    return distEclud(char1[0,0], char1[0,1], char2[0,0], char2[0,1])

def loadDataSet(fileName):      #general function to parse char relation json
    dataMat,labelsMat = [], []
    fr = open(fileName)
    data = json.load(fr)
    for char in data['chars']:
        label = char['char']
        labelsMat.append(label)

        lines = char['lines']
        curves = char['curves']
        fltLine = map(float,[lines, curves])
        dataMat.append(fltLine)
    return labelsMat, dataMat

def randCent(dataSet, k):
    n = shape(dataSet)[1]
    centroids = mat(zeros((k,n)))#create centroid mat
    for j in range(n):#create random cluster centers, within bounds of each dimension
        minJ = min(dataSet[:,j]) 
        rangeJ = float(max(dataSet[:,j]) - minJ)
        centroids[:,j] = mat(minJ + rangeJ * random.rand(k,1))
    return centroids
    
def kMeans(dataSet, k, distMeas=getDiff, createCent=randCent):
    m = shape(dataSet)[0]
    clusterAssment = mat(zeros((m,2)))#create mat to assign data points 
                                      #to a centroid, also holds SE of each point
    centroids = createCent(dataSet, k)
    clusterChanged = True
    while clusterChanged:
        clusterChanged = False
        for i in range(m):#for each data point assign it to the closest centroid
            minDist = inf; minIndex = -1
            for j in range(k):
                distJI = distMeas(centroids[j,:],dataSet[i,:])
                if distJI < minDist:
                    minDist = distJI; minIndex = j
            if clusterAssment[i,0] != minIndex: clusterChanged = True
            clusterAssment[i,:] = minIndex,minDist**2
        print centroids
        for cent in range(k):#recalculate centroids
            ptsInClust = dataSet[nonzero(clusterAssment[:,0].A==cent)[0]]#get all the point in this cluster
            if(len(ptsInClust) > 0):
                centroids[cent,:] = mean(ptsInClust, axis=0) #assign centroid to mean 
    return centroids, clusterAssment

def biKmeans(dataSet, k, distMeas=getDiff):
    m = shape(dataSet)[0]
    clusterAssment = mat(zeros((m,2)))
    centroid0 = mean(dataSet, axis=0).tolist()[0]
    centList =[centroid0] #create a list with one centroid
    for j in range(m):#calc initial Error
        clusterAssment[j,1] = distMeas(mat(centroid0), dataSet[j,:])**2
    while (len(centList) < k):
        lowestSSE = inf
        for i in range(len(centList)):
            ptsInCurrCluster = dataSet[nonzero(clusterAssment[:,0].A==i)[0],:]#get the data points currently in cluster i
            centroidMat, splitClustAss = kMeans(ptsInCurrCluster, 2, distMeas)
            sseSplit = sum(splitClustAss[:,1])#compare the SSE to the currrent minimum
            sseNotSplit = sum(clusterAssment[nonzero(clusterAssment[:,0].A!=i)[0],1])
            print "sseSplit, and notSplit: ",sseSplit,sseNotSplit
            if (sseSplit + sseNotSplit) < lowestSSE:
                bestCentToSplit = i
                bestNewCents = centroidMat
                bestClustAss = splitClustAss.copy()
                lowestSSE = sseSplit + sseNotSplit
        bestClustAss[nonzero(bestClustAss[:,0].A == 1)[0],0] = len(centList) #change 1 to 3,4, or whatever
        bestClustAss[nonzero(bestClustAss[:,0].A == 0)[0],0] = bestCentToSplit
        print 'the bestCentToSplit is: ',bestCentToSplit
        print 'the len of bestClustAss is: ', len(bestClustAss)
        centList[bestCentToSplit] = bestNewCents[0,:].tolist()[0]#replace a centroid with two best centroids 
        centList.append(bestNewCents[1,:].tolist()[0])
        clusterAssment[nonzero(clusterAssment[:,0].A == bestCentToSplit)[0],:]= bestClustAss#reassign new clusters, and SSE
    return mat(centList), clusterAssment

import matplotlib
import matplotlib.pyplot as plt
def cluster(numClust=5):
    for script in order:
        clusters = []
        labelMat, datList = loadDataSet('data/chars/'+script+'_chars.json')
        datMat = mat(datList)
        myCentroids, clustAssing = biKmeans(datMat, numClust)
        for i in range(numClust):
            clusters.append(map(float,array(myCentroids[i])[0]))
            cluster = datMat[nonzero(clustAssing[:,0].A==i)[0],:]
            for pt in cluster:
                char = map(float,array(pt)[0])
                idx = datList.index(char)
                datList[idx].append(i)
                datList[idx].append(labelMat[idx])
        outputFile = open('data/chars_outputs/'+script+'_chars_output.json', 'w')
        outputFile.write('{\n"chars":')
        outputFile.write(json.dumps(datList,indent=4))
        outputFile.write(',\n"clusters":')
        outputFile.write(json.dumps(clusters,indent=4))
        outputFile.write('\n}')

cluster(3)
