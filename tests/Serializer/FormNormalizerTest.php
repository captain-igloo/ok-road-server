<?php

declare(strict_types=1);

namespace Tests\Serializer;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Serializer\FormNormalizer;
use Override;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Form\Extension\Validator\ValidatorExtension;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\Test\TypeTestCase;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Validator\Validation;

final class FormNormalizerTest extends TypeTestCase
{
    public function testNormalize(): void
    {
        $csrfTokenManager = $this->createMock(CsrfTokenManagerInterface::class);
        $token = new CsrfToken('id', 'token');
        $csrfTokenManager->method('getToken')
            ->willReturn($token);
        $normalizer = new FormNormalizer($csrfTokenManager);
        $form = $this->factory->create(RegistrationFormType::class);
        $username = $form->get('username');
        $username->setData('username');
        $username->addError(new FormError('username error'));
        $form->addError(new FormError('form error'));
        $normalizer->normalize($form);
        $this->assertEquals(
            '{"fields":{"username":{"value":"username","errors":["username error"]}},"token":"token","errors":["form error"]}',
            json_encode($normalizer->normalize($form)),
        );
    }

    public function testSupportsNormalization(): void
    {
        $normalizer = new FormNormalizer($this->createMock(CsrfTokenManagerInterface::class));
        $this->assertTrue($normalizer->supportsNormalization($this->createMock(FormInterface::class)));
    }

    public function testGetSupportedTypes(): void
    {
        $normalizer = new FormNormalizer($this->createMock(CsrfTokenManagerInterface::class));
        $this->assertEquals([FormInterface::class => true], $normalizer->getSupportedTypes(null));
    }

    #[Override]
    protected function getExtensions(): array
    {
        $validator = Validation::createValidatorBuilder()
            ->enableAttributeMapping()
            ->getValidator();
        return [
            new ValidatorExtension($validator),
        ];
    }
}
