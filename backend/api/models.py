from django.db import models

class Project(models.Model):
    project_id = models.CharField(max_length=50, unique=True, verbose_name="项目ID")
    name = models.CharField(max_length=100, verbose_name="项目名称")
    location = models.CharField(max_length=100, verbose_name="地点")
    status = models.CharField(max_length=50, verbose_name="状态")
    my_role = models.CharField(max_length=50, verbose_name="我的角色")
    interview_time = models.DateField(verbose_name="访谈时间", null=True, blank=True)
    description = models.TextField(verbose_name="项目描述", blank=True, null=True)
    start_date = models.DateField(verbose_name="开始日期", null=True, blank=True)
    end_date = models.DateField(verbose_name="结束日期", null=True, blank=True)
    captain_id = models.CharField(max_length=100, verbose_name="支队长ID", null=True, blank=True)
    member_count = models.IntegerField(default=0, verbose_name="成员数")
    task_count = models.IntegerField(default=0, verbose_name="任务数")
    overdue_count = models.IntegerField(default=0, verbose_name="逾期数")
    progress = models.IntegerField(default=0, verbose_name="进度")

    def __str__(self):
        return self.name
