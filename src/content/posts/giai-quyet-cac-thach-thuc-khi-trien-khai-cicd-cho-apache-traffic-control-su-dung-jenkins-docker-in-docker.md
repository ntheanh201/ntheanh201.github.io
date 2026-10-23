---
title: "Giải quyết các thách thức khi triển khai CI/CD cho Apache Traffic Control sử dụng Jenkins Docker-in-Docker"
description: "Gần đây, mình đang thử nghiệm CI/CD cho source code Apache Traffic Control (ATC), stack mình quyết định dùng là Jenkins cho CI/CD và Nexus dùng làm repository, vì những bản buil…"
date: 2024-11-13
tags: ["ci/cd"]
---

Gần đây, mình đang thử nghiệm CI/CD cho source code Apache Traffic Control (ATC), stack mình quyết định dùng là Jenkins cho CI/CD và Nexus dùng làm repository, vì những bản build của ATC hiện tại đều là file RPM.

Bước đầu tiên mình muốn thực hiện nhanh trước với việc triển khai Jenkins thông qua Docker-in-Docker (Docker:dind) và Nexus bằng container (bước tiếp theo có thể là 1 cluster K8s đảm bảo tính co giãn).

Tuy nhiên, trong quá trình thực hiện, một số lỗi đã xuất hiện liên quan đến pkg builder của ATC và sẽ được trình bày chi tiết cùng với các giải pháp khả thi.

## **Bối cảnh**

Khi làm việc với Apache Traffic Control, trong mã nguồn đã có sẵn các script hỗ trợ việc xây dựng cả ATC và modified ATS. Tuy nhiên, việc tích hợp Jenkins với Docker:dind để thực hiện các bước build này đã gặp phải một số thách thức.

## **Cài đặt Jenkins và Nexus**

Để bắt đầu, có thể tham khảo tài liệu chính thức của Jenkins về cách cài đặt với Docker tại [https://www.jenkins.io/doc/book/installing/docker/](https://www.jenkins.io/doc/book/installing/docker/) và Nexus tại: [https://hub.docker.com/r/sonatype/nexus3/](https://hub.docker.com/r/sonatype/nexus3/).

Hoặc có thể tham khảo docker-compose tại đây (GitHub Actions chạy hàng ngày để đảm bảo lấy được thông tin phiên bản mới nhất của Jenkins): [https://github.com/ntheanh201/jenkins-nexus-starter](https://github.com/ntheanh201/jenkins-nexus-starter)

Sử dụng Docker:dind cho phép chạy Docker bên trong một container khác, điều này rất hữu ích cho việc xây dựng và triển khai ứng dụng. Việc này không chỉ giúp tiết kiệm tài nguyên mà còn tạo ra một môi trường cách ly, giúp dễ dàng quản lý các phiên bản và cấu hình khác nhau.

## **Các lỗi gặp phải trong quá trình triển khai**

### **1\. Không kết nối được tới Docker Dind**

Trong quá trình chạy lệnh build, đã có lỗi xảy ra:

```bash
+ ./pkg -o -b -v ats

docker: Get "https://docker:2376/_ping": dial tcp xxx.xxx.xxx.xxx:2376: i/o timeout.

See 'docker run --help'.

Building ats.

docker: Cannot connect to the Docker daemon at tcp://docker:2376. Is the docker daemon running?.

See 'docker run --help'.

Failed to build ats.

Results in 'dist':

total 0

script returned exit code 1
```

![](/img/783693a5c83675ad413fbcf2d0352e845bc0200e.png)

**Nguyên nhân:** Lỗi này thường xảy ra khi pkg builder container bên trong Jenkins container không thể kết nối tới Docker daemon đang chạy trong container Dind.

**Giải pháp: Sử dụng host network**

Để giải quyết vấn đề kết nối tới Docker Dind, một giải pháp khả thi là cập nhật lệnh Docker Compose để sử dụng host network. Điều này cho phép container bên trong Jenkins có thể truy cập trực tiếp vào Docker daemon mà không gặp phải các vấn đề về network.

Nhận thấy trong pkg script của ATC có đoạn:

```bash
COMPOSECMD=(docker run --rm "${DOCKER_ADDR[@]}" $COMPOSE_OPTIONS "${VOLUMES[@]}" -w "$(pwd)" $IMAGE docker compose)
```

Thêm *—network host* vào trong COMPOSECMD:

```bash
COMPOSECMD=(docker run --rm "${DOCKER_ADDR[@]}" $COMPOSE_OPTIONS "${VOLUMES[@]}" --network host -w "$(pwd)" $IMAGE docker compose)
```

### **2\. Thiếu Certs**

Một lỗi khác cũng đã xuất hiện trong quá trình cài đặt:

```bash
+ ./pkg -o -b -v ats

Failed to initialize: unable to resolve docker endpoint: open /certs/client/ca.pem: no such file or directory

Building ats.

Failed to initialize: unable to resolve docker endpoint: open /certs/client/ca.pem: no such file or directory

Failed to build ats.

Results in 'dist':

total 0

script returned exit code 1
```

![](/img/6625db07dea94fffdd92b8ccf10875d1b682a9df.png)

**Nguyên nhân:** Lỗi này xảy ra do ca cert của Docker chưa được mount vào trong container, dẫn đến việc không thể xác thực kết nối tới Docker daemon. Việc thiếu các cert cần thiết có thể gây ra sự cố trong việc thiết lập kết nối an toàn giữa các container.

**Giải pháp: Mount certs vào pkg builder container**

Để khắc phục lỗi liên quan đến ca cert, chú ý đến đoạn:

```bash
volumes:
      - jenkins-docker-certs:/certs/client
```

nằm trong docker-compose service *jenkins-docker* và *jenkins-blueocean,* cho nên cần mount thư mục /certs vào trong docker in (docker in docker) - dindind 😄

Nhận thấy trong pkg rơi vào trường hợp:

```bash
DOCKER_ADDR=(-e DOCKER_HOST -e DOCKER_TLS_VERIFY -e DOCKER_CERT_PATH)
```

Thêm vào như sau:

```bash
DOCKER_ADDR=(-e DOCKER_HOST -e DOCKER_TLS_VERIFY -e DOCKER_CERT_PATH -v "/certs/client:/certs/client")
```

Việc này đảm bảo rằng các cert cần thiết sẽ có sẵn trong pkg builder container, giúp thiết lập kết nối an toàn với Docker daemon (Dind).

## **Thành quả**

![](/img/90eec5eda2e2c9481855ec7cbfe1b651dbcb3538.png)

Sau khi thực hiện các thay đổi trên, quá trình build Apache Traffic Server đã thành công.

Chi tiết xem tại PR:

[https://github.com/ntheanh201/trafficcontrol/pull/10](https://github.com/ntheanh201/trafficcontrol/pull/10)

Bên trong PR có demo Jenkinsfile cho việc chạy CI ATS và đẩy các file RPM lên Nexus repo

```bash
pipeline {
    agent any

    environment {
        // Nexus credentials should be configured in Jenkins credentials
        NEXUS_CREDENTIAL_ID = 'nexus-credentials'
        NEXUS_URL = 'http://nexus:8081'
        // Nexus repository should be configured in Nexus yum(hosted) repository
        NEXUS_REPOSITORY = 'atc-rpms'
        NEXUS_GROUP_ID = 'org.apache.trafficcontrol'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build ATS') {
            steps {
                sh '''
                    # Build the ATS package
                    ./pkg -o -b -v ats
                    # Store RPM filenames for later use
                    find dist -name "*.rpm" -type f > rpm_files.txt
                '''

                // Archive the RPMs as Jenkins artifacts
                archiveArtifacts artifacts: 'dist/*.rpm', fingerprint: true
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    try {
                        echo "Starting Upload to Nexus stage"

                        withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIAL_ID}",
                                                    usernameVariable: 'NEXUS_USER',
                                                    passwordVariable: 'NEXUS_PASS')]) {
                            echo "Credentials loaded successfully"

                            // Read the list of RPM files
                            def rpmFiles = readFile('rpm_files.txt').trim().split('\n')

                            rpmFiles.each { rpmFile ->
                                if (!fileExists(rpmFile)) {
                                    error "RPM file does not exist at ${rpmFile}"
                                }

                                def rpmName = rpmFile.tokenize('/')[-1]
                                echo "Processing RPM: ${rpmName}"

                                // Extract version from RPM filename using pattern matching
                                // Assuming filename format: name-version-release.arch.rpm
                                def version = sh(
                                    script: """
                                        filename=\$(basename ${rpmFile})
                                        echo \$filename | sed -E 's/.*-([0-9]+\\.[0-9]+\\.[0-9]+)-.*\\.rpm/\\1/'
                                    """,
                                    returnStdout: true
                                ).trim()

                                if (version.isEmpty() || version == rpmName) {
                                    error "Could not extract version from RPM filename: ${rpmName}"
                                }
                                echo "RPM version: ${version}"

                                // Upload to Nexus using curl
                                echo "Uploading to Nexus: ${NEXUS_URL}/repository/${NEXUS_REPOSITORY}/${NEXUS_GROUP_ID}/${version}/${rpmName}"
                                def curlResponse = sh(
                                    script: """
                                        curl -v -k -u ${NEXUS_USER}:${NEXUS_PASS} \
                                            --upload-file '${rpmFile}' \
                                            '${NEXUS_URL}/repository/${NEXUS_REPOSITORY}/${NEXUS_GROUP_ID}/${version}/${rpmName}'
                                    """,
                                    returnStatus: true
                                )

                                if (curlResponse != 0) {
                                    error "Curl upload failed with status ${curlResponse} for ${rpmName}"
                                }
                                echo "Upload completed for ${rpmName}"
                            }
                        }

                    } catch (Exception e) {
                        echo "Error in Upload to Nexus stage: ${e.getMessage()}"
                        error "Failed to upload to Nexus: ${e.getMessage()}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean workspace after build
            cleanWs()
        }
        success {
            echo 'Successfully built and published RPM to Nexus'
        }
        failure {
            echo 'Failed to build or publish RPM'
        }
    }
}
```

Lí do chiếc PR này mình không contribute lên apache trafficcontrol repo là bởi vì nó là một phần riêng biệt so với các CI tests mà trafficcontrol đang sử dụng, cũng như là 1 thử nghiệm với hướng đi chi tiết hơn so với mức độ tổng quát của trafficcontrol.

## **Kết luận**

Cài đặt Jenkins bằng Docker:dind có thể gặp phải một số thách thức, nhưng với những giải pháp phù hợp, người dùng có thể vượt qua chúng một cách hiệu quả. Việc hiểu rõ nguyên nhân của các lỗi và cách khắc phục sẽ giúp cho quá trình triển khai trở nên suôn sẻ hơn. Hy vọng bài viết này sẽ cung cấp thông tin hữu ích cho những ai đang tìm hiểu về việc triển khai Jenkins trong môi trường Docker, đồng thời khuyến khích cộng đồng chia sẻ thêm kinh nghiệm và giải pháp để cải thiện quy trình phát triển phần mềm.
