pipeline {
    agent {
        label "my-jenkins-agent"
    }
    environment {
        AWS_REGION = "ap-east-1"
        AWS_ACCOUNT_ID = "927190304276"
        ECR_REGISTRY = "927190304276.dkr.ecr.ap-east-1.amazonaws.com"
        ECR_REPOSITORY = "test-dev"
        IMAGE_TAG = IMAGE_TAG = { it -> "${github.sha}" }()
    }
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t $ECR_REPOSITORY:$IMAGE_TAG .'
            }
        }
        stage('Push to ECR') {
            steps {
                withCredentials([[
                    credentialsId: '927190304276.dkr.ecr.ap-east-1.amazonaws.com',
                    accessKeyVariable: 'AKIA5PYGZIYKH2KQNMNO',
                    secretKeyVariable: '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'
                ]]) {
                    sh "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
                    sh "docker tag $ECR_REPOSITORY:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"
                    sh "docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"
                }
            }
        }
    }
}
