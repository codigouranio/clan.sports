ENV_ID=e-9rpdjyqntm
NEW_ENV_NAME=e-9rpdjyqntm
APP_ID=clan-sports
CUR_VER=clan-sports-2024-10-31T01-34-58-592Z
SOL_STACK_NAME=awseb-e-9rpdjyqntm-stack

aws elasticbeanstalk describe-configuration-settings \
  --application-name $APP_ID \
  --environment-name $ENV_ID \
  --query 'ConfigurationSettings[0]' > environment-config.json

aws elasticbeanstalk create-environment \
  --application-name $APP_ID \
  --environment-name $NEW_ENV_NAME \
  --template-name <your-configuration-template> \
  --solution-stack-name $SOL_STACK_NAME \
  --option-settings file://environment-config.json

aws elasticbeanstalk describe-environments \
  --application-name $APP_ID \
  --environment-names $ENV_ID \
  --query 'Environments[0].VersionLabel'

aws elasticbeanstalk update-environment \
  --environment-name $NEW_ENV_NAME \
  --version-label $CUR_VER

aws elasticbeanstalk swap-environment-cnames \
  --source-environment-name $ENV_ID \
  --destination-environment-name $NEW_ENV_NAME
